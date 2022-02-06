const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require('./config');

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
};

class authController {
    async registration (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({message: 'registration errors ', errors});
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if (candidate) {
                return res.status(400).json({massage: 'User already exist'});
            }
            const userRole = await Role.findOne({value: 'USER'});
            const hashPassword = bcrypt.hashSync(password, 6);
            const user = new User({username, password: hashPassword, role: [ userRole.value ]});
            await user.save();
            return res.json({message: 'User was successfully registered'});
        } catch (e) {
            console.log (e);
            res.status(400).json({massage: 'Registration error'})
        }
    }
    async login (req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(400).json(`${username} was not found`);
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json('login and/or password error');
            }
            const token = generateAccessToken(user._id, user.role);
            return res.status(200).json({token});
        } catch (e) {
            console.log (e);
            res.status(400).json({massage: 'Login error'})
        }
    }
    async getUsers (req, res) {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (e) {
            console.log (e);
        }
    }
}

module.exports = new authController();