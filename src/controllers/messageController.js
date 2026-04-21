import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import {createMessageService, reactMessageService} from '../services/messageService.js';

export const createMessage = async (req, res) => {
  try {
    const {chatId, senderId, type, content, isSeen, mediaUrl, messageId, status} = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({success: false, message: 'Nhóm chat không tồn tại!'});
    }

    // 1. tạo messages
    const message = await createMessageService({chatId, senderId, type, content, isSeen, mediaUrl, messageId, status});

    return res.status(200).json({
      success: true,
      message: 'Tạo tin nhắn thành công!',
      data: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
  }
};

export const getMessages = async (req, res) => {
  try {
    const {chatId, cursor, limit = 20} = req.query;

    const query = {chatId};

    //nếu có cursor thì lấy message cũ hơn
    if (cursor) {
      query._id = {
        $lt: cursor,
      };
    }

    const messages = await Message.find(query)
      .sort({_id: -1}) // mới → cũ
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: messages,
      nextCursor: messages.length > 0 ? messages[messages.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server!',
    });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const {messageId} = req.query;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(400).json({success: false, message: 'Không tồn tại tin nhắn!'});
    }

    return res.status(200).json({success: true, message: 'Lấy tin nhắn thành công!', data: message});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
  }
};

export const reactMessage = async (req, res) => {
  try {
    const {chatId, messId, react, userId} = req.body;

    const reactMess = await reactMessageService({chatId, messId, react, userId});

    if (!reactMess) {
      return res.status(404).json({
        success: false,
        message: 'Không tồn tại tin nhắn',
      });
    }

    return res.status(200).json({
      success: true,
      data: reactMess.react,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
  }
};
