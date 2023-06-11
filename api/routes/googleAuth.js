const app = require("express").Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const querystring = require("querystring");
const {
  SERVER_ROOT_URI,
  GOOGLE_CLIENT_ID,
  JWT_SECRET,
  GOOGLE_CLIENT_SECRET,
  COOKIE_NAME,
  REDIRECT_HTML
} = require("../config");

const { addUser, checkEmail } = require("../user");

const redirectURI = "auth/google";

function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ].join(" ")
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
app.get("/google/url", (req, res) => {
  return res.json(getGoogleAuthURL());
});

function getTokens({ code, clientId, clientSecret, redirectUri }) {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code"
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}

// Getting the user from Google with the code
app.get("/google", async (req, res) => {
  const { query: { code } } = req;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  const addResponse = await addUser(googleUser);

  if (!addResponse.ok) return res.status(500).json(addResponse);
  const token = jwt.sign(addResponse.user, JWT_SECRET);

  res.cookie(COOKIE_NAME, token, {
    path: "/",
    maxAge: 900000,
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  res.send(REDIRECT_HTML);
});

// Getting the current user
app.get("/user", (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(204).json(null);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json(decoded);
  } catch (err) {
    console.log(err);
    res.json(null);
  }
});

app.get("/email", async (req, res) => {
  const {
    query: { id }
  } = req;
  const response = await checkEmail(id);
  res.json(response);
});

app.get("/logout", (req, res) => {
  res.cookie(COOKIE_NAME, null, {
    path: "/",
    maxAge: -100,
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.send();
});

module.exports = app;
