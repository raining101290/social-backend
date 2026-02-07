const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../config/upload');
const ctrl = require('../controllers/user.controller');

router.get('/me', auth, ctrl.getMe);

router.put('/me', auth, ctrl.updateProfile);

router.put('/me/password', auth, ctrl.changePassword);

router.put('/me/avatar', auth, upload.single('profileImage'), ctrl.updateAvatar);

module.exports = router;
