// src/socket/socket.js
import {Server} from 'socket.io';
import {createMessageService, reactMessageService, removeReactMessageService} from '../services/messageService.js';

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
    socket.on('sendMessage', async (data, callback) => {
      try {
        const {chatId, senderId, type, content, isSeen, mediaUrl, messageId, receiverId, status} = data;

        const message = await createMessageService({
          chatId,
          senderId,
          type,
          content,
          isSeen,
          mediaUrl,
          messageId,
          status: 'sent', // 🔥 set ở BE
        });

        const messageToObj = message.toObject();

        // ✅ ACK cho người gửi
        callback(messageToObj);

        // 📡 gửi cho người khác
        io.to(receiverId).emit('receiveMessage', messageToObj);
      } catch (err) {
        console.error(err);
        // ❌ báo lỗi cho client
        callback({error: true});
      }
    });

    // send react message
    socket.on('reactMessage', async (data, callback) => {
      try {
        const {chatId, messId, react, userId, receiverId} = data;

        const reactMess = await reactMessageService({chatId, messId, react, userId});

        if (reactMess) {
          // ✅ ACK cho người gửi
          callback(data);

          // 📡 gửi cho người khác
          io.to(receiverId).emit('receiveReactMessage', data);
        }
      } catch (err) {
        console.error(err);
        // ❌ báo lỗi cho client
        callback({error: true});
      }
    });

    //remove react message
    socket.on('removeReactMessage', async (data, callback) => {
      try {
        const {chatId, messId, userId, receiverId} = data;

        const reactMess = await removeReactMessageService({chatId, messId, userId});

        if (reactMess) {
          // ✅ ACK cho người gửi
          callback(data);

          // 📡 gửi cho người khác
          io.to(receiverId).emit('receiveRemoveReactMessage', data);
        }
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
