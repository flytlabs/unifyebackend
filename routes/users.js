const express = require('express');
const router = express.Router();
const user = require('../components/user');
const authenticateUser = require('../app/authenticateUser');

router.get('/', (req, res) => {
    res.status(200).json({ info: 'The /users path'});
});

router.post('/login', user.loginUser);
router.post('/register', user.registerUser);
router.post('/logout', authenticateUser, user.logoutUser);

module.exports = router;