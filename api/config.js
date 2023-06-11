require("dotenv").config();

const configConstants = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SERVER_ROOT_URI: process.env.SERVER_ROOT_URI,
  UI_ROOT_URI: process.env.UI_ROOT_URI,
  JWT_SECRET: "shhhhh",
  COOKIE_NAME: "auth_token",
  REDIRECT_HTML: `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Please wait...</title>
  </head>
  <body>
    <div>Please wait...</div>

    <script type="text/javascript">
    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage("");
      // close the popup
      window.close();
    }
    </script>
  </body>
</html>
`
};

module.exports = { ...configConstants };
