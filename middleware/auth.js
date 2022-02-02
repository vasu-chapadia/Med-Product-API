const jwt = require("jsonwebtoken");
require("dotenv/config");

const auth = (req, res, next) => {
  try {
    const secret = process.env.secret;
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const verify = jwt.verify(token, secret);
    // console.log(verify.userType )
    if (verify.userType === "admin") {
      next();
    } else {
      return res.status(401).json({ message: "Invalid Token" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Invalid Token",
    });
  }
};
module.exports = auth;
