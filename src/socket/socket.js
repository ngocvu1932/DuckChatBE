// src/socket/socket.js
import {Server} from 'socket.io';
import Message from '../models/messageModel.js';
import Chat from '../models/chatModel.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://chat-with-vunn.netlify.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log('🔥 Client connected:', socket.id);

    // join user
    socket.on('joinUser', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // send message
    // socket.on('sendMessage', ({message}) => {
    //   console.log('mess', message);

    //   const {receiverId} = message;

    //   // gửi cho người nhận
    //   io.to(receiverId).emit('receiveMessage', message);
    // });

    socket.on('sendMessage', async (data, callback) => {
      try {
        const {chatId, senderId, type, content, isSeen, mediaUrl, messageId, receiverId} = data;

        // 1. tạo message
        const createNewMessage = await Message.create({
          chatId,
          senderId,
          type,
          content,
          isSeen,
          mediaUrl,
          messageId,
        });

        const message = createNewMessage.toObject();

        // ✅ ACK cho người gửi
        callback(message);

        // 📡 gửi cho người khác
        io.to(receiverId).emit('receiveMessage', message);

        // 2. update chat (lastMessage + seen)
        await Chat.updateOne(
          {_id: chatId},
          {
            $set: {
              lastMessage: {
                messageId: message._id,
                sender: senderId,
                content: message.content,
                timestamp: message.createdAt ?? new Date(),
              },
            },
            $pull: {
              isSeen: senderId, // remove sender khỏi seen
            },
          },
        );
      } catch (err) {
        console.error(err);
        // ❌ báo lỗi cho client
        callback({error: true});
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  return io;
};

// dùng khi cần emit ngoài socket
export const getIO = () => {
  if (!io) throw new Error('Socket not initialized!');
  return io;
};
