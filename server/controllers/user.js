const router = require('express').Router();

const passport = require('../middlewares/authentication');
const User = require('../models/user');
const IEX = require('../apis/IEX');

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

      inventory.forEach((item, i) => {
        response[i].openPrice = result.data[item.ticker].quote.open;
        response[i].latestPrice = result.data[item.ticker].quote.latestPrice;
      });

      res.json({ inventory: response });
    })
    .catch(err =>{
      res.status(500).send("INTERNAL_SERVER_ERROR: " + err);
    });
});

// @Route PUT /api/user/buy
router.put('/buy', passport.isLoggedIn(), (req, res) => {
  req.body.shares = parseInt(req.body.shares);
  const newUser = { ...req.user._doc };
  const params = {
    types: 'quote',
    token: process.env.API_KEY
  };

  IEX.get(`/stock/${req.body.ticker}/batch`, {params})
    .then(result => {
      if(result.data.quote.latestPrice * req.body.shares > newUser.balance) {
        return res.status(400).send({message:'Not enough money!'});
      }
      newUser.transactions.push({ ticker: req.body.ticker, shares: req.body.shares, atPrice: result.data.quote.latestPrice });
      newUser.balance -= req.body.shares * result.data.quote.latestPrice;

      let updated = false;
      newUser.inventory.forEach((item, i) =>{
        if(item.ticker === req.body.ticker) {
          newUser.inventory[i].shares += req.body.shares;
          updated = true;
        }
      });

      if (!updated) newUser.inventory.push({ticker: req.body.ticker, shares: req.body.shares});
      User.updateOne({ email: newUser.email }, newUser, (userErr, userRes) =>{
        if(userErr) return res.status(501).send({message: "Database error, update failed"});
        res.status(200).send('updated user');
      });
    })
    .catch(err => res.status(500).send({message: "IEX request failed."}));

})

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