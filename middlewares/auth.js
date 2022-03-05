const { verify } = require("jsonwebtoken");
require('dotenv').config()

exports.isSignIn = async (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    const user = verify(token, process.env.JWT_SECRET);
    console.log(user);
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
