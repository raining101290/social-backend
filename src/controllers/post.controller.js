const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { createNotification } = require('../services/notification.service');

exports.createPost = async (req, res) => {
    const post = await Post.create({
        userId: req.userId,
        body: req.body.text,
    });

    res.json({
        success: true,
        data: post,
    });
};

exports.getPosts = async (req, res) => {
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const limit = Math.min(50, Number(req.query.limit) || 10);

    const posts = await Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit },

        // join user
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userId',
            },
        },
        { $unwind: '$userId' },

        // join comments for count
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'postId',
                as: 'comments',
            },
        },

        {
            $addFields: {
                commentsCount: { $size: '$comments' },
            },
        },

        {
            $project: {
                body: 1,
                likes: 1,
                createdAt: 1,
                updatedAt: 1,
                commentsCount: 1,
                'userId._id': 1,
                'userId.name': 1,
                'userId.profileImage': 1,
            },
        },
    ]);

    const total = await Post.countDocuments();

    res.json({
        success: true,
        data: posts,
        meta: {
            offset,
            limit,
            total,
            hasMore: offset + posts.length < total,
        },
    });
};

exports.getPostDetail = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .select('body userId likes createdAt updatedAt')
        .populate('userId', 'name profileImage');

    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }

    const comments = await Comment.find({
        postId: req.params.id,
    })
        .select('text userId createdAt')
        .populate('userId', 'name profileImage')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: {
            post,
            comments,
        },
    });
};

exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false });

    if (post.userId.toString() !== req.userId) {
        return res.status(403).json({ success: false });
    }

    await post.deleteOne();

    res.json({ success: true });
};

exports.likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }

    const liked = post.likes.includes(req.userId);

    if (liked) {
        post.likes.pull(req.userId);
    } else {
        post.likes.push(req.userId);
    }

    await post.save();

    if (!liked && post.userId.toString() !== req.userId) {
        await createNotification({
            senderId: req.userId,
            receiverId: post.userId,
            type: 'like',
            title: 'liked your post',
            data: {
                postId: post._id,
            },
        });
    }

    res.json({
        success: true,
        data: {
            likesCount: post.likes.length,
            liked: !liked,
        },
    });
};

exports.commentPost = async (req, res) => {
    if (!req.body.text?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Comment text required',
        });
    }

    const post = await Post.findById(req.params.id).select('userId');

    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }

    const comment = await Comment.create({
        postId: req.params.id,
        userId: req.userId,
        text: req.body.text.trim(),
    });

    await createNotification({
        senderId: req.userId,
        receiverId: post.userId,
        type: 'comment',
        title: 'commented on your post',
        data: {
            postId: post._id,
            commentId: comment._id,
        },
    });

    const populated = await comment.populate('userId', 'name profileImage');

    res.json({
        success: true,
        data: populated,
    });
};
