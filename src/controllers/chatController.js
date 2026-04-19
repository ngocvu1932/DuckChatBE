import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import {createChatOk} from '../services/chatService.js';

export const createChat = async (req, res) => {
  try {
    const {user, chatName, isSeen, groupImgUri} = req.body;

    let userInfo;
    if (user.length == 1) {
      userInfo = await User.findById(user[0]);
    }

    if (!userInfo) {
      return res.status(400).json({success: false, message: 'Người dùng không tồn tại!'});
    }

    user.push(req.user.userId);

    if (user.length < 2) {
      return res.status(400).json({success: false, message: 'Cần ít nhất 2 người!'});
    }

    const existingChatname = await Chat.findOne({chatName});
    const existingChatUser = await Chat.findOne({user});

    if (existingChatname || existingChatUser) {
      return res.status(400).json({success: false, message: 'Nhóm chat đã tồn tại!'});
    }

    const newChat = await createChatOk({
      user,
      isGroupChat: user.length >= 3 ? true : false,
      chatName: user.length >= 3 ? chatName : 'Chat private',
      isSeen,
      groupImgUri:
        user.length >= 3
          ? groupImgUri
            ? groupImgUri
            : 'https://res.cloudinary.com/ngocvu1932/image/upload/v1737708926/chatWithVunn/avtChatGroup/p8sfxkcvvyjbnnnsaitr.png'
          : 'Chat private image',
    });

    if (!newChat) {
      return res.status(400).json({success: false, message: 'Tạo nhóm chat thất bại!'});
    }
    return res.status(200).json({success: true, message: 'Tạo nhóm chat thành công!', data: newChat});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: error});
  }
};

export const createMessage = async (req, res) => {
  try {
    const {chatId, senderId, type, content, isSeen, mediaUrl, messageId} = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({success: false, message: 'Nhóm chat không tồn tại!'});
    }

    // 1. tạo message
    const message = await Message.create({
      chatId,
      senderId,
      type,
      content,
      isSeen,
      mediaUrl,
      messageId,
    });

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

export const getChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chats = await Chat.find({user: userId});

    if (!chats || chats.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Không có nhóm chat!',
        data: [],
      });
    }

    const chatsRes = await Promise.all(
      chats.map(async (chat) => {
        const chatRes = chat.toObject();

        // Tìm thông tin user trong nhóm chat
        const userInfo = await User.find({_id: {$in: chatRes.user}})
          .select('_id fullname online avatar')
          .exec();

        chatRes.user = userInfo;

        delete chatRes.__v;
        return chatRes;
      }),
    );
    return res.status(200).json({success: true, message: 'Lấy danh sách nhóm chat thành công!', data: chatsRes});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
  }
};

export const getChatById = async (req, res) => {
  try {
    const {chatId} = req.query;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(400).json({success: false, message: 'Nhóm chat không tồn tại!'});
    }

    return res.status(200).json({success: true, message: 'Lấy thông tin nhóm chat thành công!', data: chat});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
  }
};

export const getMessages = async (req, res) => {
  try {
    const {chatId} = req.query;

    const messages = await Message.find({chatId: chatId}).sort({createdAt: 1}); // 1 = tăng dần (cũ → mới)
    if (!messages) {
      return res.status(400).json({success: false, message: 'Không có tin nhắn!'});
    }
    return res.status(200).json({success: true, message: 'Lấy tin nhắn thành công!', data: messages});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
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
