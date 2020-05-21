const express = require('express');
const router = express.Router();

const userController = require('./user');
const stockController = require('./stock');

router.use('/user', userController);
router.use('/stock', stockController);

module.exports = router;