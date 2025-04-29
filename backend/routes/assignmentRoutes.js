const express = require('express');
const router = express.Router();
const { createAssignment, updateAssignment, getAllAssignments } = require('../controllers/assignmentController');
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

router.get('/getAllAssignments', authMiddleware, getAllAssignments);
router.post('/assignment', authMiddleware, createAssignment);
router.put('/assignment', authMiddleware, updateAssignment);

module.exports = router;
