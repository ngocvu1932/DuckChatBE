import express from 'express';
import {createChat, getMessageById} from '../controllers/chatController.js';
import {createMessage} from '../controllers/chatController.js';
import {getChats} from '../controllers/chatController.js';
import {getChatById} from '../controllers/chatController.js';
import {getMessages} from '../controllers/chatController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

/**
 * @swagger
 * /api/chat/create-chat:
 *   post:
 *     summary: Create a new chat
 *     security:
 *       - BearerAuth: []
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                  type: array
 *                  items:
 *                     type: string
 *                     format: uuid # Nếu các giá trị là UUID
 *                  example:
 *                  - "67762c47dbfdc1fa0bc5242f"
 *               chatName:
 *                 type: string
 *                 description: Name for chat.
 *                 example: Chat name
 *               isSeen:
 *                  type: array
 *                  items:
 *                     type: string
 *                     format: uuid
 *                  example:
 *                  - "67762c47dbfdc1fa0bc5242f"
 *               groupImgUri:
 *                 type: string
 *                 description: Url img for chat.
 *                 example: https://example.com/img.jpg
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
router.post('/create-chat', authMiddleware, createChat);

/**
 * @swagger
 * /api/chat/get-chats:
 *   get:
 *     summary: Get all message
 *     security:
 *       - BearerAuth: []
 *     tags: [Chat]
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
router.get('/get-chats', authMiddleware, getChats);

/**
 * @swagger
 * /api/chat/get-chat-by-id:
 *   get:
 *     summary: Get chat by id
 *     security:
 *       - BearerAuth: []
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67762c47dbfdc1fa0bc5242f
 *     responses:
 *       200:
 *         description: Chat fetched successfully
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
 *         description: Chat fetched successfully
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
router.get('/get-chat-by-id', authMiddleware, getChatById);

/**
 * @swagger
 * /api/chat/create-message:
 *   post:
 *     summary: Create a new message
 *     security:
 *       - BearerAuth: []
 *     tags: [Chat]
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
 * /api/chat/get-messages:
 *   get:
 *     summary: Get all messages
 *     security:
 *       - BearerAuth: []
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       201:
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
router.get('/get-messages', authMiddleware, getMessages);

/**
 * @swagger
 * /api/chat/get-message-by-id:
 *   get:
 *     summary: Get message by id
 *     security:
 *       - BearerAuth: []
 *     tags: [Chat]
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

export default router;
