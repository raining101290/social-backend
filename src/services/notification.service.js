const admin = require('../config/firebase');

module.exports = async (token, title, body) => {
    try {
        if (!token) return;

        await admin.messaging().send({
            token,
            notification: { title, body },
        });
        console.log('FCM sent →', token.slice(0, 10));
    } catch (err) {
        console.error('FCM ERROR:', err.message);
    }
};
