const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.isSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!token) {
      return res.status(400).json({ error: "You don't have permission !!!" });
    }

    req.user_id = user.user_id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
