import express from 'express';
import {upload} from '../middlewares/upload.js';
import {uploadAudio} from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @swagger
 * /api/media/audio:
 *   post:
 *     summary: Upload file ghi âm
 *     description: API upload file audio (ghi âm) lên Cloudinary và trả về URL để sử dụng trong message realtime.
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File audio (webm/mp3/wav)
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: "https://res.cloudinary.com/xxx/audio.mp3"
 *                 duration:
 *                   type: number
 *                   example: 3.5
 *       400:
 *         description: Thiếu file hoặc file không hợp lệ
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "File is required"
 *       401:
 *         description: Chưa xác thực (JWT)
 *       500:
 *         description: Lỗi server / upload thất bại
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Upload failed"
 */
router.post('/audio', upload.single('file'), uploadAudio);

export default router;
