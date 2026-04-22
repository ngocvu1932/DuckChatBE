import {createMessage, getMessageById, getMessages, reactMessage, removeReactMessage} from '../controllers/messageController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/message/create-message:
 *   post:
 *     summary: Create a new message
 *     security:
 *       - BearerAuth: []
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 format: uuid
 *                 description: chatID for message.
 *                 example: 6785da5b42d0790439789f9b
 *               senderId:
 *                 type: string
 *                 format: uuid
 *                 description: Sender for the chat
 *                 example: 67762c47dbfdc1fa0bc5242f
 *               type:
 *                 type: string
 *                 description: Type for message (TEXT, IMAGE, VIDEO, AUDIO, FILE)
 *                 example: TEXT
 *               content:
 *                 type: string
 *                 description: content for message
 *                 example: Hello
 *               isSeen:
 *                  type: array
 *                  items:
 *                     type: string
 *                     format: uuid
 *                  example:
 *                  - "67762c47dbfdc1fa0bc5242f"
 *               mediaUrl:
 *                 type: string
 *                 description: media url for message
 *                 example: Hello
 *     responses:
 *       200:
 *         description: Chat successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatId:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the created chat
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Chat created successfully
 *       201:
 *         description: Chat successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatId:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the created chat
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Chat created successfully
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
router.post('/create-message', authMiddleware, createMessage);

/**
 * @swagger
 * /api/message/get-messages:
 *   get:
 *     summary: Lấy danh sách tin nhắn theo chatId (phân trang cursor)
 *     tags: [Message]
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện
 *
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *           type: string
 *         description: _id của tin nhắn cuối cùng (dùng để load thêm)
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng tin nhắn mỗi lần load
 *
 *     responses:
 *       200:
 *         description: Lấy tin nhắn thành công
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
 *                         example: 69e4a1404794c8990cc646c0
 *                       chatId:
 *                         type: string
 *                         example: 67a2c2fd8be0452239e4e900
 *                       senderId:
 *                         type: string
 *                         example: 67a2c24b8be0452239e4e8f3
 *                       type:
 *                         type: string
 *                         example: text
 *                       content:
 *                         type: string
 *                         example: "thử lại"
 *                       mediaUrl:
 *                         type: string
 *                         example: ""
 *                       messageId:
 *                         type: string
 *                         example: "265ece45-517f-4cc3-9495-03b543ed551d"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-04-19T09:32:48.841Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-04-19T09:32:48.841Z
 *
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   example: 69e4a1404794c8990cc646c0
 *
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 */
router.get('/get-messages', authMiddleware, getMessages);

/**
 * @swagger
 * /api/message/get-message-by-id:
 *   get:
 *     summary: Get message by id
 *     security:
 *       - BearerAuth: []
 *     tags: [Message]
 *     parameters:
 *       - in: query
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67762c47dbfdc1fa0bc5242f
 *     responses:
 *       200:
 *         description: Message fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatId:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the created chat
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Chat created successfully
 *       201:
 *         description: Message fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatId:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the created chat
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Chat created successfully
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
router.get('/get-message-by-id', authMiddleware, getMessageById);

/**
 * @swagger
 * /api/message/react-message:
 *   post:
 *     summary: Thả cảm xúc (react) cho tin nhắn
 *     tags: [Message]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - messId
 *               - react
 *               - userId
 *             properties:
 *               chatId:
 *                 type: string
 *                 example: "67a2c2fd8be0452239e4e900"
 *               messId:
 *                 type: string
 *                 example: "69e4a1404794c8990cc646c0"
 *               react:
 *                 type: string
 *                 example: "👍"
 *               userId:
 *                 type: string
 *                 example: "67a2c24b8be0452239e4e8f3"
 *
 *     responses:
 *       200:
 *         description: React thành công
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
 *                       react:
 *                         type: string
 *                         example: "👍"
 *                       count:
 *                         type: integer
 *                         example: 2
 *                       user:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["user1", "user2"]
 *
 *       404:
 *         description: Không tìm thấy tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Không tồn tại tin nhắn
 *
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Lỗi server!
 */
router.post('/react-message', authMiddleware, reactMessage);

/**
 * @swagger
 * /api/message/remove-react-message:
 *   post:
 *     summary: Remove react cua user khoi tin nhan
 *     tags: [Message]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - messId
 *               - userId
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID cua chat
 *                 example: "67a2c2fd8be0452239e4e900"
 *               messId:
 *                 type: string
 *                 description: ID cua tin nhan
 *                 example: "69e4a1404794c8990cc646c0"
 *               userId:
 *                 type: string
 *                 description: ID user can xoa react
 *                 example: "67a2c24b8be0452239e4e8f3"
 *
 *     responses:
 *       200:
 *         description: Remove react thanh cong
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
 *                       react:
 *                         type: string
 *                         example: "like"
 *                       count:
 *                         type: integer
 *                         example: 1
 *                       user:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["user1"]
 *
 *       404:
 *         description: Khong tim thay tin nhan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Khong ton tai tin nhan
 *
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Loi server!
 */
router.post('/remove-react-message', authMiddleware, removeReactMessage);

export default router;
