const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notification.controller');

router.get('/', auth, ctrl.getNotifications);
router.post('/', auth, ctrl.createNotification);
router.patch('/:id/read', auth, ctrl.markRead);
router.patch('/read-all', auth, ctrl.markAllRead);
router.get('/unread-count', auth, ctrl.getUnreadCount);

module.exports = router;
