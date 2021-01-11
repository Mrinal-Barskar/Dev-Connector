const express = require('express');

const router = express.Router();

//@route    get api/posts
//@desc     Test Route
//@access   Public
router.get('/', (req, res, next) => res.send('posts route'));

module.exports = router;