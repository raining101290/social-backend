const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
    const notif = await Notification.create({
        senderId: req.userId,
        receiverId: req.body.receiverId,
        title: req.body.title,
        type: req.body.type,
        data: req.body.data,
    });

    res.json({ success: true, data: notif });
};

exports.getNotifications = async (req, res) => {
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const limit = Math.min(50, Number(req.query.limit) || 20);

    const items = await Notification.find({
        receiverId: req.userId,
    })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('senderId', 'name profileImage')
        .select('-__v');

    const total = await Notification.countDocuments({
        receiverId: req.userId,
    });

    res.json({
        success: true,
        data: items,
        meta: {
            offset,
            limit,
            total,
            hasMore: offset + items.length < total,
        },
    });
};

exports.markRead = async (req, res) => {
    await Notification.updateOne(
        { _id: req.params.id, receiverId: req.userId },
        { read: true }
    );

    res.json({ success: true });
};

exports.markAllRead = async (req, res) => {
    await Notification.updateMany(
        { receiverId: req.userId, read: false },
        { read: true }
    );

    res.json({ success: true });
};

exports.getUnreadCount = async (req, res) => {
    const count = await Notification.countDocuments({
        receiverId: req.userId,
        read: false,
    });

    res.json({ success: true, data: count });
};
