const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res) => {
    const user = await User.findById(req.userId).select('-password');

    res.json({
        success: true,
        data: user,
    });
};

exports.updateProfile = async (req, res) => {
    const allowed = ['name', 'age', 'phone', 'gender', 'bio'];

    const updates = {};

    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select(
        '-password'
    );

    res.json({
        success: true,
        data: user,
        message: 'Profile updated',
    });
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
        return res.status(400).json({
            success: false,
            message: 'Old password incorrect',
        });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
        success: true,
        message: 'Password updated',
    });
};

exports.updateAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Image required',
        });
    }

    const relativePath = `/uploads/${req.userId}/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
        req.userId,
        { profileImage: relativePath },
        { new: true }
    ).select('-password');

    res.json({
        success: true,
        data: user,
        message: 'Avatar updated',
    });
};
