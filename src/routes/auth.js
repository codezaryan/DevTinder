const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validator");
const bcrypt = require('bcrypt');
const User = require("../models/user");

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, email, password, age, gender, photoUrl, about, skills } = req.body;
        
        // Check if email already exists (email is already lowercased by validator)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already exists!");
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashPassword, age, gender, photoUrl, about, skills});
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid Credentials!");
        if (!user.password) throw new Error("Invalid Credentials!");
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 3600000) });
            res.send("Login Successful!");
        } else {
            throw new Error("Invalid Password!");
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    try {
        res.cookie("token", null, {
             expires: new Date(Date.now()) 
            });
        res.send("Logout Successful!");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = authRouter