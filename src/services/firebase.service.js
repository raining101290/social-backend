const admin = require('../config/firebase');

exports.sendPush = async (token, title, body, data = {}) => {
    try {
        if (!token) return;

        await admin.messaging().send({
            token,
            notification: { title, body },
            data: Object.fromEntries(
                Object.entries(data).map(([k, v]) => [k, String(v)])
            ),
        });

        console.log('FCM sent →', token.slice(0, 10));
    } catch (err) {
        console.error('FCM ERROR:', err.message);
    }
};
