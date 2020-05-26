const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const PORT = process.env.PORT || 8080;
const expressSession = require('express-session');
const path = require('path');

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

// Controller setup
app.use('/api', require('./controllers'));

//serve static files 
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// all unknown routes should be handed to our react app
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, ()=> console.log('listening on port ', PORT));