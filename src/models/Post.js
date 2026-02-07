const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
