import express from 'express';
import {logout, registerUser, sendMailVerification, verifyEmail} from '../controllers/userController.js';
import {loginUser} from '../controllers/userController.js';
import {refreshToken} from '../controllers/userController.js';
import {getProfile} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

/**
//  * @swagger
 * /api/auth/send-email:
 *   post:
 *     summary: Send email verification
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email for the new user
 *                 example: john.doe@example.com
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 */
router.post('/send-email', sendMailVerification);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user
 *                 example: JohnDoe
 *               email:
 *                 type: string
 *                 description: Email for the new user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64fa1f2b8cd7e81234567890
 *                     username:
 *                       type: string
 *                       example: JohnDoe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64fa1f2b8cd7e81234567890
 *                     username:
 *                       type: string
 *                       example: JohnDoe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the verify new user
 *                 example: xxxxx
 *               email:
 *                 type: string
 *                 description: Email for the verify new user
 *                 example: john.doe@example.com
 *               verifyCode:
 *                 type: string
 *                 description: VerifyCode from email
 *                 example: 12xx34xx
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
router.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's email
 *                 example: 'ngocvu'
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *                   example: "your-jwt-token"
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Đăng nhập thành công!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: uuid
 *                       description: User ID
 *                       example: 67762c47dbfdc1fa0bc5242f
 *                     phone:
 *                       type: string
 *                       description: User's phone number
 *                       example: ""
 *                     username:
 *                       type: string
 *                       description: Username
 *                       example: ngocvu
 *                     fullname:
 *                       type: string
 *                       description: Full name
 *                       example: Ngoc Vu
 *                     email:
 *                       type: string
 *                       description: Email address
 *                       example: ""
 *                     password:
 *                       type: string
 *                       description: Encrypted password
 *                       example: $2a$10$j2kxrt8bBoWB1XgD8TBRD.v5iLzl7nFReQFyz0uhcbYdptsqXwmRi
 *                     avatar:
 *                       type: string
 *                       description: URL to the user's avatar
 *                       example: ""
 *                     address:
 *                       type: string
 *                       description: User's address
 *                       example: ""
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the user was created
 *                       example: "2025-01-02T06:03:51.340Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the user was last updated
 *                       example: "2025-01-02T06:03:51.340Z"
 *                     __v:
 *                       type: integer
 *                       description: Version key
 *                       example: 0
 *                     accessToken:
 *                       type: string
 *                       description: Access token for authentication
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       description: Refresh token for authentication
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: User refresh-token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The user's refresh-token
 *                 example: 'your-jwt-token'
 *     responses:
 *       200:
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *                   example: "your-jwt-token"
 *       201:
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *                   example: "your-jwt-token"
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/auth/get-profile:
 *   get:
 *     summary: Lấy thông tin user từ token
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64fbcf49c1d1234567abcd12"
 *                     username:
 *                       type: string
 *                       example: "NgocVu"
 *                     email:
 *                       type: string
 *                       example: "ngocvu@example.com"
 *       201:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64fbcf49c1d1234567abcd12"
 *                     username:
 *                       type: string
 *                       example: "NgocVu"
 *                     email:
 *                       type: string
 *                       example: "ngocvu@example.com"
 *       401:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Token không hợp lệ hoặc hết hạn!"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
router.get('/get-profile', authMiddleware, getProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất tài khoản
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Đăng xuất thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64fbcf49c1d1234567abcd12"
 *                     username:
 *                       type: string
 *                       example: "NgocVu"
 *                     email:
 *                       type: string
 *                       example: "ngocvu@example.com"
 *       201:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thành công!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64fbcf49c1d1234567abcd12"
 *                     username:
 *                       type: string
 *                       example: "NgocVu"
 *                     email:
 *                       type: string
 *                       example: "ngocvu@example.com"
 *       401:
 *         description: Token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Token không hợp lệ hoặc hết hạn!"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
router.post('/logout', authMiddleware, logout);

export default router;
