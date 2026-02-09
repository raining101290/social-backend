const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model('Comment', commentSchema);
