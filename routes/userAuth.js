const Joi = require('joi');
const bcrpyt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid username or password.')
    
    const validPassword = await bcrpyt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid username or password.')

    const token = user.generateAuthToken();
    
    res
        .header("X-auth-token",token)
        .header("access-control-expose-headers","x-auth-token")
        .send(_.pick(user,["_id","userName","email"]));
});

// Information Expert Principle


function validate(req){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}


module.exports = router;