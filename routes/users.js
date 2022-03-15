const auth=require('../middleware/authentication');
const bcrpyt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const validateObjectId=require('../middleware/validateObjectId');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')
    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrpyt.genSalt(10)
    user.password = await bcrpyt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    
    res.header('x-auth-token',token).send(_.pick(user, ['id', 'name', 'email']));
});

router.get('/:id',validateObjectId,async(req,res) => {
    const user= await User
        .findById(req.params.id)
        .select('-password')
        .select('-__v');

    if (!user) {
        return res.status(404).send('The ID was not found');
    }
    res.send(user);
})

function validateUserPut(req) {
    const schema = Joi.object({
        fullName: Joi.string().min(5).max(30).required(),
        password: Joi.string().min(8).max(20).required()
    }).options({ abortEarly: false });

    return schema.validate(req);
}


module.exports = router;