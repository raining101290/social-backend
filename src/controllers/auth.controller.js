const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res) => {
    const { name, email, password, fcmToken } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        profileImage: null,
        password: hash,
        gender: null,
        age: null,
        bio: null,
        fcmToken,
    });
    const tokenData = generateToken(user._id);
    res.json({
        success: true,
        token: tokenData.token,
        expiresAt: tokenData.expiresAt,
    });
};

exports.login = async (req, res) => {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });

    user.fcmToken = fcmToken;
    await user.save();

    res.json({
        success: true,
        token: generateToken(user._id).token,
    });
};
