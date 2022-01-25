const Users = require("./models/Users");

const createUser = (newUser) => {
  const [givenName, familyName] = newUser.name.split(" ");
  return Users.create({
    ...newUser,
    googleId: newUser.id || null,
    email: newUser.email,
    verified_email: newUser.verified_email || false,
    given_name: newUser.given_name || givenName,
    family_name: newUser.family_name || familyName
  });
};

const checkEmail = async (email) => {
  try {
    const user = await Users.findOne({ email }).exec();
    if (user) return { exists: true, google: Boolean(user.googleId) };
    return { exists: false };
  } catch (err) {
    console.log(err);
    return { ok: false, err: err.message };
  }
};

const addUser = async (decoded) => {
  try {
    let user;
    user = await Users.findOne({ googleId: decoded.id }).exec();
    if (user) {
      user = await createUser(decoded);
    }
    user = user.toJSON();
    user.id = user._id.toString();
    if (user) return { ok: true, user };
    return { ok: false, err: "Something went wrong" };
  } catch (err) {
    console.log(err);
    return { ok: false, err: err.message };
  }
};

module.exports = { addUser, createUser, checkEmail };
