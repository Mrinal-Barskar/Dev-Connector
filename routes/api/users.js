const express = require('express');

const router = express.Router();

//@route    get api/users
//@desc     Test Route
//@access   Public
router.get('/', (req, res, next) => res.send('user route'));

module.exports = router;