const express = require('express');

const router = express.Router();

//@route    get api/profile
//@desc     Test Route
//@access   Public
router.get('/', (req, res, next) => res.send('Profile route'));

module.exports = router;