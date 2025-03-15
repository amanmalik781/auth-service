// AuthService.js
// 4f47b46777fcc48b668eb9dafa82c298FFFFNRAL
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const newrelic = require('newrelic');
const User = require('./User'); // Define a User model in models/User.js

mongoose.connect('mongodb://host.docker.internal:27017/taskmanagement', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Simulate random delay
    const delay = Math.random() * 5000; // up to 5 seconds delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate random failure
    if (Math.random() < 0.3) { // 30% chance to fail
        return res.status(500).send('Random server error');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simulate random delay
    const delay = Math.random() * 5000; // up to 5 seconds delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate random failure
    if (Math.random() < 0.3) { // 30% chance to fail
        return res.status(500).send('Random server error');
    }

    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).send('Invalid credentials');
    } else {
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    }
});

app.listen(3002, () => console.log('Auth Service is running on port 3002'));