const express = require('express');
const router = express.Router();
const userTag = require('../components/usertag');
const authenticateUser = require('../app/authenticateUser');

router.get('/', (req, res) => {
    res.status(200).json({ info: 'The /usertags path'});
});
router.get('/:id', userTag.retrieveUserTag);

router.post('/createanonymously', userTag.createUserAnonymouslyTag);
router.post('/create', authenticateUser, userTag.createUserTag);
router.post('/update', authenticateUser, userTag.updateUserTag);

module.exports = router;