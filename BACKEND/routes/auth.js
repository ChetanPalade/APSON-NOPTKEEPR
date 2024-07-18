// routes
const express = require('express');
const router = express.Router();
const User = require('../server/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  try {
    await user.save();
    res.send('User registered successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Email or password is wrong');

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('Email or password is wrong');

  const token = jwt.sign({ _id: user._id }, 'secretKey');
  res.header('Authorization', `Bearer ${token}`).send('Logged in');
});

module.exports = router;
