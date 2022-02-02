const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
require("dotenv/config");
const auth = require("../middleware/auth");

router.get(`/`, auth, async (req, res) => {
  // const userList = await User.find().select("-password");
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password.toString(), 10),
    phone: req.body.phone,
    userType: req.body.userType,
  });
  user = await user.save();
  if (!user) return res.status(400).send("the user cannot be created!");
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  //   console.log(process.env.secret);
  if (!user) {
    return res.status(400).send("The user not found");
  }
  if (user && bcrypt.compareSync(req.body.password.toString(), user.password)) {
    const token = jwt.sign(
      {
        //object we use for making object
        userId: user.id,
        userType: user.userType,
      },
      secret,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});

module.exports = router;
