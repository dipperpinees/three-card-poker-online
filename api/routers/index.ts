import express from 'express';
import upload from '../lib/multer';

const router = express.Router();

router.post('/avatar', upload.single('avatar'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: 'Fail upload a file' });
    }
    res.json({ avatar: file?.filename });
});

export default router;
