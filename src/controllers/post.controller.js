const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const notify = require('../services/notification.service');

exports.createPost = async (req, res) => {
  const post = await Post.create({
    author: req.userId,
    text: req.body.text
  });

  res.json(post);
};

exports.getPosts = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = 10;

  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 })
    .skip((page-1)*limit)
    .limit(limit);

  res.json(posts);
};

exports.getPostDetail = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username');

  const comments = await Comment.find({
    post: req.params.id
  }).populate('author', 'username');

  res.json({
    success: true,
    data: { post, comments }
  });
};


exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  const liked = post.likes.includes(req.userId);

  if (liked)
    post.likes.pull(req.userId);
  else
    post.likes.push(req.userId);

  await post.save();

  if (!liked && post.author.toString() !== req.userId) {
    const author = await User.findById(post.author);
    notify(author.fcmToken, "New Like", "Someone liked your post");
  }

  res.json(post.likes.length);
};

exports.commentPost = async (req, res) => {
  const comment = await Comment.create({
    post: req.params.id,
    author: req.userId,
    text: req.body.text
  });

  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.userId) {
    const author = await User.findById(post.author);
    notify(author.fcmToken, "New Comment", req.body.text);
  }

  res.json(comment);
};
