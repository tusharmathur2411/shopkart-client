const {
    JWT_SECRET,
    COOKIE_NAME,
} = require("../config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).send();
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id
        return next();
    } catch (err) {
        console.log(err);
        res.status(401).send();
    }
}