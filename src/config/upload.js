const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const userId = req.userId;
        const dir = path.join(__dirname, '..', 'uploads', userId);

        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },

    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${Date.now()}${ext}`);
    },
});

module.exports = multer({ storage });
