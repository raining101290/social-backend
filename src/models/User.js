const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true },
        password: {
            type: String,
        },
        fcmToken: String,

        profileImage: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', null],
            default: null,
        },
        phone: {
            type: String,
        },
        age: {
            type: Number,
            min: 13,
            max: 120,
        },
        bio: {
            type: String,
            maxLength: 300,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
