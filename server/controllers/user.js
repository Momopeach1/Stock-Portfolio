const router = require('express').Router();

const passport = require('../middlewares/authentication');
const User = require('../models/user');
const IEX = require('../apis/IEX');
const axios = require('axios');

// @Route GET /api/user/check
router.get('/check', passport.isLoggedIn(), (req, res) => {
  res.json(req.user);
});

// @Route GET /api/user
router.get('/', (req, res, next) => {
  User.findOne({ email: req.body.email}, (error, result) => {
    if(error) return res.status(500).send(error);
  });
  res.json(result);
});

// @Route POST /api/user/signup
router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(err) return next(err);
    if(user) return res.status(422).send({ error: 'Email is already in use!' });

    const newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });

    newUser.save(err => {
      if(err) return next(err);
      res.json({ success: true });
    });
  });
});

// @route GET /api/user/inventory
router.get('/inventory', passport.isLoggedIn(), (req, res) =>{
  console.log('getting stonks in inv');
  const inventory = req.user.inventory;

  if(inventory.length === 0) return res.status(500).send('Inventory is empty');
  const tickers = [];
  inventory.forEach(item => { tickers.push(item.ticker) } );
  const params = {
    symbols: tickers.join(','),
    types: 'quote',
    token: process.env.API_KEY
  }

  IEX.get('/stock/market/batch', {params})
    .then(result => {
      const response = [ ...inventory ];
      console.log(response);
      inventory.forEach((item, i) => response[i].latestPrice = result.data[item.ticker].quote.latestPrice);
      console.log(response);
      res.json({ inventory: response });
    })
    .catch(err =>{
      res.status(500).send("INTERNAL_SERVER_ERROR: " + err);
    });
});

// @Route POST /api/user/signin
router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// @Route POST /api/user/signout
router.post('/signout', (req, res) => {
  req.logout();
  res.status(200).json({ success: true });
});

module.exports = router;