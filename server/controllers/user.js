const router = requre('express').Router();

const passport = require('../middlewares/authentication');
const User = require('../models/user');

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

// @Route POST /api/user/signin
router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// @Route POST /api/user/signout
router.post('/signout', (req, res) => {
  req.logout();
  res.status(200).json({ success: true });
});
