const express = require('express');
require('dotenv').config();
const User = require('../models/userModel');
const bcyrpt = require('bcrypt');

const Route = express();
Route.use(express.json());

// signUp

Route.post('/signUp', async (req, res) => {

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                messag: 'Error'
            })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' })
        }

        const hashedPassword = await bcyrpt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ message: 'Server error', error });
    }
})

//Login APi

Route.post('/Login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and Password are required!',
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found!',
            });
        }

        const isPasswordMatched = await bcyrpt.compare(password, user.password)


        if (!isPasswordMatched) {

            return res.status(401).json({
                message: 'Invalid password!',
            });
        }

        res.status(200).json({
            isSuccessfull: true,
            message: 'Successfully logged in!',
            user: {
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
});

Route.post('/todo', (req, res) => {
    const body = req.body;
    try {
        const obj = {
            text: body.text
        };

        if (!obj.text) {
            res.status(400).json({
                isSuccessfull: false,
                message: 'Error',
                data: null
            });
        } else {
            res.status(201).json({
                isSuccessfull: true,
                message: 'Successfully posted',
                data: obj
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = Route

