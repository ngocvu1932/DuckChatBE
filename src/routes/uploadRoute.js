import express from 'express';
import {upload} from '../middlewares/upload.js';
import {uploadAudio, uploadImages} from '../controllers/uploadController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

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
router.post('/audio', authMiddleware, upload.single('file'), uploadAudio);

/**
 * @swagger
 * /api/media/images:
 *   post:
 *     summary: Upload nhiều hình ảnh lên Cloudinary
 *     description: API nhận tối đa 5 file ảnh và trả về danh sách URL đã upload.
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
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file ảnh (tối đa 5)
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
 *                 message:
 *                   type: string
 *                   example: Upload thành công!
 *                 data:
 *                   type: object
 *                   properties:
 *                     urls:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: https://res.cloudinary.com/xxx/image/upload/v123/duckchat/images/abc.jpg
 *       400:
 *         description: Thiếu file hoặc vượt quá số lượng
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Files are required
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Lỗi server!
 */
router.post('/images', authMiddleware, upload.array('images', 5), uploadImages);

export default router;
