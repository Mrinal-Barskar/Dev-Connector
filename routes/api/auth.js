const express = require('express');

const router = express.Router();

//@route    get api/auth
//@desc     Test Route
//@access   Public
router.get('/', (req, res, next) => res.send('Auth route'));

module.exports = router;