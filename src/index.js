const express = require('express')
require('dotenv').config()
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const aiRoutes = require('./routes/ai');
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');


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


app.get('/test', (req, res) => {
  res.send("Server is running!");
});

app.use('/', authRouter)

app.use('/', profileRouter)

app.use('/', requestRouter)

app.use('/', aiRoutes);
