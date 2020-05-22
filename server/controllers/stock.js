const router = require('express').Router();

const passport = require('../middlewares/authentication');
const User = require('../models/user');

// @Route GET /api/stock
router.get('/', passport.isLoggedIn(), (req, res) => {
  
})
module.exports = router;