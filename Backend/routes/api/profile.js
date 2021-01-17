const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');

const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const request = require('request');
const config = require("config");

const Post = require('../../models/Post');


//@route    GET api/profile/me
//@desc     Get Current users profile
//@access   private
router.get('/me', auth, async (req, res, next) => {
    try{
        const profile = await Profile.findOne({ user : req.user.id }).populate('user', 
        ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({msg : 'There is no profile for this User'})
        }
        
        res.json(profile);
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
});

//@route    POST api/profile
//@desc     create or update a user Profile
//@access   private
router.post('/',[
    auth,
    // check('status', 'Status is Required ')
    //     .not()
    //     .isEmpty(),
    check("skills", 'Skills is Requirred')
        .not()
        .isEmpty()
], 
async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array() });
    }

    const {
        company,
        website,
        location,
        status,
        githubusername,
        bio,
        skills,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = req.body;

    //Build profile object
    const profileFields = {};

    profileFields.user = req.user.id

    if(company) profileFields.company = company.toString();
    if(website) profileFields.website = website.toString();
    if(location) profileFields.location = location.toString();
    if(bio) profileFields.bio = bio.toString();
    if(status) profileFields.status = status.toString();
    if(githubusername) profileFields.githubusername = githubusername.toString();
    // console.log(skills);
    // console.log(typeof(skills), typeof(status));

    if(skills) {
        str = skills.toString()
        profileFields.skills = str.split(',').map(skill => skill.trim())
    }

    //Build social object
    profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube.toString();
        if (twitter) profileFields.social.twitter = twitter.toString();
        if (facebook) profileFields.social.facebook = facebook.toString();
        if (linkedin) profileFields.social.linkedin = linkedin.toString();
        if (instagram) profileFields.social.instagram = instagram.toString();

    try {
        let profile = await Profile.findOne({ user : req.user.id })

        if(profile) {
            //update
            profile = await Profile.findOneAndUpdate(
                { user : req.user.id }, 
                { $set : profileFields}, 
                { new : true}
            );
            return res.json(profile);
        }

        //Create Profile

        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile)

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/profile
//@desc     GET  all profiles
//@access   public

router.get('/',async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/profile/user/:user_id
//@desc     GET profile by userID
//@access   public

router.get('/user/:user_id',async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.params.user_id}).populate('user', ['name', 'avatar']);
        res.json(profile);

        if(profile) return res.status(400).json({ msg : 'Profile Not Found'});

        res.json(profile);
    } catch (err) {
        console.error(err.message);

        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg : 'Profile Not Found'});
        }

        //res.status(500).send('Server Error');
    }
});

//@route    DELETE api/profile
//@desc     Delete profil, user & posts
//@access   private
router.delete('/', auth, async (req, res) => {
    try {
        //Remove Posts
        await Post.deleteMany({ user : req.user.id })

        //Remove Profile
        await Profile.findOneAndRemove({ user : req.user.id});
        //Remove User
        await User.findOneAndRemove({ _id : req.user.id});
        
        res.json({ msg : 'User Deleted'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/profile/experience
//@desc     Add Profile Experience
//@access   Private

router.put('/experience', [auth, [
    check('title' ,'Title is Required')
        .not()
        .isEmpty(),
    check('company', 'Company is Required')
        .not()
        .isEmpty(),
    check('from', 'Start Date is Required')
        .not()
        .isEmpty()
]], 
async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array() })
    }

    const {
        title,
        company,
        location,
        from, 
        to,
        current,
        description 
    } = req.body

    console.log(typeof(to));
    const newExp = {
        title : title.toString(),
        company : company.toString(),
        location : location.toString(),
        from : Date.parse(from),
        to : Date.parse(to) || null,
        current : Boolean(current),
        description : description.toString()
    }

    try {
        const profile = await Profile.findOne({ user : req.user.id})

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete Experience from Profile
//@access   Private
router.delete('/experience/:expId', auth, async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user : req.user.id });

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        //Remove experince at the given index
        profile.experience.splice(removeIndex, 1)

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/profile/education
//@desc     Add Profile Education
//@access   Private

router.put('/education', [auth, [
    check('school' ,'School is Required')
        .not()
        .isEmpty(),
    check('degree', 'Degree is Required')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'Field of Study is Required')
        .not()
        .isEmpty(),
    check('from', 'Start Date is Required')
        .not()
        .isEmpty()
]], 
async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array() })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from, 
        to,
        description 
    } = req.body

    const newEdu = {
        school : school.toString(),
        degree : degree.toString(),
        fieldofstudy : fieldofstudy.toString(),
        from : Date.parse(from),
        to : Date.parse(to) || null,
        description : description.toString()
    }

    try {
        const profile = await Profile.findOne({ user : req.user.id})

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from Profile
//@access   Private
router.delete('/education/:eduId', auth, async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user : req.user.id });

        //Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        //Remove experince at the given index
        profile.education.splice(removeIndex, 1)

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/profile/github/:username
//@desc     GET user repos from git hub
//@access   Public 
router.get('github/:username', async (req, res, next) => {
    try {
        const options = {
            uri : `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
                    &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method : 'GET',
            headers : {'user-agent' : 'node.js'}
        }

        request(options, (error, response, body) => {
            console.log('pass 1');
            if(error) console.error(error);
            console.log('pass 2');
            if(response.statusCode !== 200) {
                return res.status(404).json({ msg : 'No github profile found'})
            }
            console.log('pass 3');
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;