const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/post.controller');

router.post('/', auth, ctrl.createPost);
router.get('/', auth, ctrl.getPosts);
router.get('/:id', auth, ctrl.getPostDetail);
router.post('/:id/like', auth, ctrl.likePost);
router.post('/:id/comment', auth, ctrl.commentPost);
router.delete('/posts/:id', auth, ctrl.deletePost);

module.exports = router;
