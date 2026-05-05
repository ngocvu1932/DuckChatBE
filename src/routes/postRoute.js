import express from 'express';
import {createPost, getPosts} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

/**
 * @swagger
 * /api/post/create-post:
 *   post:
 *     summary: Create a new post
 *     description: Tao bai dang moi cho user dang dang nhap. Token Bearer la bat buoc.
 *     security:
 *       - BearerAuth: []
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Noi dung bai post
 *                 example: "Hom nay minh dang bai dau tien tren DuckChat."
 *               images:
 *                 type: array
 *                 description: Danh sach URL hinh anh dinh kem
 *                 items:
 *                   type: string
 *                 example:
 *                   - "https://example.com/post-image.jpg"
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, FRIENDS, PRIVATE]
 *                 default: PUBLIC
 *                 example: PUBLIC
 *     responses:
 *       201:
 *         description: Tao post thanh cong
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
 *                   example: Tao bai post thanh cong!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6819e4a1404794c8990cc646c0
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 67762c47dbfdc1fa0bc5242f
 *                         fullname:
 *                           type: string
 *                           example: Nguyen Van A
 *                         username:
 *                           type: string
 *                           example: nguyenvana
 *                         avatar:
 *                           type: string
 *                           example: https://example.com/avatar.jpg
 *                     content:
 *                       type: string
 *                       example: Hom nay minh dang bai dau tien tren DuckChat.
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                     likeCount:
 *                       type: integer
 *                       example: 0
 *                     commentCount:
 *                       type: integer
 *                       example: 0
 *                     isLiked:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Du lieu khong hop le
 *       401:
 *         description: Chua dang nhap hoac token khong hop le
 *       500:
 *         description: Loi server
 */
router.post('/create-post', authMiddleware, createPost);

/**
 * @swagger
 * /api/post/get-posts:
 *   get:
 *     summary: Get all posts
 *     description: Lay danh sach tat ca bai post, sap xep moi nhat truoc. Token Bearer la bat buoc.
 *     security:
 *       - BearerAuth: []
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 50
 *         example: 20
 *     responses:
 *       200:
 *         description: Lay danh sach post thanh cong
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
 *                   example: Lay danh sach bai post thanh cong!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6819e4a1404794c8990cc646c0
 *                       user:
 *                         type: object
 *                       content:
 *                         type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                       likeCount:
 *                         type: integer
 *                         example: 18
 *                       commentCount:
 *                         type: integer
 *                         example: 2
 *                       isLiked:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 35
 *                     hasMore:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Chua dang nhap hoac token khong hop le
 *       500:
 *         description: Loi server
 */
router.get('/get-posts', authMiddleware, getPosts);

export default router;
