const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ['like', 'comment', 'follow', 'system'],
            required: true,
            index: true,
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        read: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
