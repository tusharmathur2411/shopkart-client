const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  googleId: String,
  email: { type: String, required: true },
  verified_email: { type: Boolean, default: false },
  name: { type: String, required: true },
  given_name: { type: String, required: true },
  family_name: { type: String, required: true },
  picture: String,
  locale: String
});

module.exports = model("User", userSchema);
