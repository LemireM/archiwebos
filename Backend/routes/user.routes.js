const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users.controller');
const auth = require('../middlewares/auth');

router.post('/login', userCtrl.login);
router.get('/me', auth, userCtrl.user);
//router.post('/signup', userCtrl.signup);

module.exports = router;
