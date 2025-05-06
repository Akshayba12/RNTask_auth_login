const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 8080;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
app.listen(port, () => {
  console.log('Server is running on port 8080');
});

mongoose
  .connect('mongodb+srv://akshay:akshaya@cluster0.yyja8er.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(err => {
    console.log(err);
  });

// app.listen(port, () => {
//   console.log('server is running on port 8000');
// });

const User = require('./models/user');
const Order = require('./models/order');

//funcion to verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transport

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'akshaybajantri12@gmail.com',
      pass: 'anrjgkacacqtntcv',
    },
  });
  //compose the email message
  const mailOptions = {
    from: 'amazon.com',
    to: email,
    subject: 'email verification',
    text: `Please check the following link to verify your email : http://localhost:8080/verify/${verificationToken}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.log('error sending verification email', error);
  }
};

//endpoint to register in the app
app.post('/register', async (req, res) => {
  res.send('This is the registration page.');
  try {
    const {name, email, password} = req.body;

    //To check wheather user already exits
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already exists'});
    }

    //create a new user
    const newUser = new User({name, email, password});

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString('hex');

    //save the user to the database
    await newUser.save();

    //send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log('error registering user', error);
    res.status(500).json({message: 'Registration failed'});
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login the user
app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    console.log('req', req);

    //check the user exists
    const user = await User.find({email});
    console.log('user', user);
    if (!user) {
      return res.status(404).json({message: 'Invalid email or password'});
    }

    console.log('pas', user[0].password);
    console.log('pas1', password);

    if (user[0].password !== password) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({message: 'Login failed'});
  }
});

//endpoint to verify the email
app.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;

    //Find the user within the given verification token
    const user = await User.findOne({verificationToken: token});
    console.log(user);
    if (!user) {
      return res.status(404).json({message: 'Invalid verification token'});
    }

    //mark the user verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({message: 'Email verified successfuly'});
  } catch (error) {
    res.status(500).json({message: 'EMail verification failed'});
  }
});

//endpoint to store a new address to the backend
app.post('/addresses', async (req, res) => {
  try {
    const {userId, address} = req.body;

    const user = await User.findById(userId);
    if (user) {
      return res.status(404).json({message: 'user not found'});
    }
    user.address.push(address);

    //save the user in the backend
    await user.save();

    res.status(200).json({message: 'Adress created successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error adding address'});
  }
});

//endpoint to get all the address of a particular user
app.get('/addresses/userId:', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({message: 'user not found'});
    }
    const addresses = user.address;
    res.status(200).json({addresses});
  } catch (error) {
    res.status(500).json({message: 'Error retrieveing the addresses'});
  }
});
