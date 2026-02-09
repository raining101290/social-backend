const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendPush } = require('./firebase.service');

exports.createNotification = async ({ senderId, receiverId, type, title, data = {} }) => {
    if (senderId.toString() === receiverId.toString()) return null;

    const notification = await Notification.create({
        senderId,
        receiverId,
        type,
        title,
        data,
    });

    const receiver = await User.findById(receiverId).select('fcmToken');

    if (receiver?.fcmToken) {
        await sendPush(receiver.fcmToken, title, 'Tap to view', {
            type,
            ...data,
            notificationId: notification._id.toString(),
        });
    }

    return notification;
};
