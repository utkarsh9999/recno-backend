// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const connect=require('./connections/connection');
const {response} = require("express");

router.post('/sql-register',async (req,res)=>{
    
});
// Registration API Complete
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error in creating user' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(req.body.email+" "+req.body.password);
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/profile', verifyToken, async (req
    , res) => {
    const user = await User.findById(req.user.userId);
    console.log(user);
    res.json(user);
});

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    //const token = req.header('Authorization');
    console.log("token : "+token);
    if (!token) return res.status(401).send('Access Denied');
    try {
        jwt.verify(token, 'secretKey', (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(400).send('Invalid Token '+token);
    }
}

module.exports = router;
