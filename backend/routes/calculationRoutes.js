const express = require('express');
const router = express.Router();
const { calculate } = require('../controllers/calculationController');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        next();
    });
};

router.post('/calculate', authMiddleware, calculate);

module.exports = router;
