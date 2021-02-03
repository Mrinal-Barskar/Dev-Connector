const express = require('express');

const { check, validationResult } = require('express-validator');

const gravatar = require('gravatar');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const User = require("../../models/User");

const config = require('config');

const router = express.Router();

//@route    POST api/users
//@desc     Register User
//@access   Public
router.post('/',[
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include a Valid Email').isEmail(),
    check('password', 'Please Enter a password with 6 or more characters').isLength({ min : 6 })
],
async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array() });
    }

    const { name, email, password} = req.body;

    try{
        //See if user Exists
        let user = await User.findOne({ email })

        if(user) {
            return res.status(400).json({errors : [{ msg : 'User Already Exists' }] });
        }

        //Get users gravatar
        const avatar = gravatar.url(email, {
            s : '200',
            r : 'pg',
            d : 'mm'
        })

        //creatinf new instance of User Model
        user = new User({
            name, 
            email, 
            avatar, 
            password
        })

        //encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        //SAVING user
        await user.save();

        //Return jsonwebtoken
        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            {expiresIn : 360000},
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            });

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;