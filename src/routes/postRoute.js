import express from 'express';
import {commentPost, createPost, getPosts, getPostsByUserId, likePost} from '../controllers/postController.js';
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
 *         name: cursor
 *         required: false
 *         schema:
 *           type: string
 *         description: _id cua post cuoi cung trong lan load truoc, dung de lay post cu hon
 *         example: 6819e4a1404794c8990cc646c0
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
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   example: 6819e4a1404794c8990cc646c0
 *       401:
 *         description: Chua dang nhap hoac token khong hop le
 *       500:
 *         description: Loi server
 */
router.get('/get-posts', authMiddleware, getPosts);

/**
 * @swagger
 * /api/post/get-posts-by-user/{userId}:
 *   get:
 *     summary: Get posts by userId
 *     description: Lay danh sach bai post cua mot user theo userId, sap xep moi nhat truoc. Token Bearer la bat buoc.
 *     security:
 *       - BearerAuth: []
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID cua user can lay danh sach post
 *         example: 67762c47dbfdc1fa0bc5242f
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *           type: string
 *         description: _id cua post cuoi cung trong lan load truoc, dung de lay post cu hon
 *         example: 6819e4a1404794c8990cc646c0
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
 *         description: Lay danh sach post theo user thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 67762c47dbfdc1fa0bc5242f
 *                           fullname:
 *                             type: string
 *                             example: Nguyen Van A
 *                           username:
 *                             type: string
 *                             example: nguyenvana
 *                           avatar:
 *                             type: string
 *                             example: https://example.com/avatar.jpg
 *                           online:
 *                             type: boolean
 *                             example: true
 *                       content:
 *                         type: string
 *                         example: Hom nay minh dang bai dau tien tren DuckChat.
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
 *                       visibility:
 *                         type: string
 *                         enum: [PUBLIC, FRIENDS, PRIVATE]
 *                         example: PUBLIC
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
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   example: 6819e4a1404794c8990cc646c0
 *       400:
 *         description: userId thieu hoac khong hop le
 *         content:
 *           application/json:
 *             examples:
 *               missingUserId:
 *                 value:
 *                   success: false
 *                   message: "userId la bat buoc!"
 *               invalidUserId:
 *                 value:
 *                   success: false
 *                   message: "userId khong hop le!"
 *       401:
 *         description: Chua dang nhap hoac token khong hop le
 *       404:
 *         description: Khong tim thay nguoi dung
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Nguoi dung khong ton tai!"
 *       500:
 *         description: Loi server
 */
router.get('/get-posts-by-user/:userId', authMiddleware, getPostsByUserId);

/**
 * @swagger
 * /api/post/like-post:
 *   post:
 *     summary: Like hoặc bỏ like bài viết
 *     description: API cho phép người dùng like hoặc bỏ like một bài viết. Nếu đã like trước đó thì sẽ bỏ like, ngược lại sẽ thêm like.
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "665f1c2a9c1234567890abcd"
 *     responses:
 *       200:
 *         description: Like hoặc bỏ like thành công
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
 *                   example: "Like bai post thanh cong!"
 *                 data:
 *                   type: object
 *                   description: Dữ liệu bài viết sau khi đã cập nhật like
 *       400:
 *         description: Thiếu postId
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "postId la bat buoc!"
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Post khong ton tai!"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Loi server!"
 */
router.post('/like-post', authMiddleware, likePost);

/**
 * @swagger
 * /api/post/comment:
 *   post:
 *     summary: Comment bài viết
 *     description: API cho phép người dùng thêm comment vào bài viết. Comment mới sẽ được đưa lên đầu danh sách.
 *     tags: [Post]
 *     security:
 *         - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "665f1c2a9c1234567890abcd"
 *               content:
 *                 type: string
 *                 example: "Bai viet hay qua!"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://image1.jpg", "https://image2.jpg"]
 *     responses:
 *       200:
 *         description: Comment thành công
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
 *                   example: "Comment thanh cong!"
 *                 data:
 *                   type: object
 *                   description: Dữ liệu bài viết sau khi đã thêm comment
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             examples:
 *               missingPostId:
 *                 value:
 *                   success: false
 *                   message: "postId la bat buoc!"
 *               invalidPostId:
 *                 value:
 *                   success: false
 *                   message: "postId khong hop le!"
 *               emptyContent:
 *                 value:
 *                   success: false
 *                   message: "Noi dung comment khong duoc rong!"
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Post khong ton tai!"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Loi server!"
 */
router.post('/comment', authMiddleware, commentPost);

export default router;
