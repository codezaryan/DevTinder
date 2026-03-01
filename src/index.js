const express = require('express')
const bcrypt = require('bcrypt')
require('dotenv').config()
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;

connectDB()
  .then(() => {
    console.log("DB Connected!");
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password, age, gender } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashPassword, age, gender });
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(404).send("Error while user signing in: " + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid Credentials!");
    if (!user.password) throw new Error("Invalid Credentials!");
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 7 * 3600000) });
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid Password!");
    }
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post('/sendRequest', userAuth, async (req, res) => {
  const user = req.user;
  console.log(user.firstName + " sending request...");
  res.send(user.firstName + " send request!");
});

app.get('/test', (req, res) => {
  res.send("Server is running!");
});

app.use('/api/ai', aiRoutes);
