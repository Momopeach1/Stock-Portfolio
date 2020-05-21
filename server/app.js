const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const PORT = process.env.PORT || 8080;
const expressSession = require('express-session');

//Middlewares and controllers
const passport       = require('./middlewares/authentication');
const User           = require('./models/user');

//APP start up
app.use(express.json());
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//Mongoose connection
const mongooseOptions = { 
  useNewUrlParser: true,  
  useUnifiedTopology: true, 
  useCreateIndex: true 
};
mongoose.connect(process.env.MONGO_URI, mongooseOptions);

app.listen(PORT, ()=> console.log('listening on port ', PORT));