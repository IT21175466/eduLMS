const express = require('express');
const router = express.Router();
const { registerInstructor, loginInstructor } = require('../controllers/userController');

router.post('/register', registerInstructor);
router.post('/login', loginInstructor);

module.exports = router;
