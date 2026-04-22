import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';

export const createMessageService = async ({chatId, senderId, type, content, isSeen, mediaUrl, messageId, status}) => {
  try {
    // 1. tạo message
    const createMessage = await Message.create({
      chatId,
      senderId,
      type,
      content,
      isSeen,
      mediaUrl,
      messageId,
      status,
      react: [],
    });

    // 2. update chat (lastMessage + seen)
    await Chat.updateOne(
      {_id: chatId},
      {
        $set: {
          lastMessage: {
            messageId: createMessage._id,
            sender: senderId,
            content: createMessage.content,
            timestamp: createMessage.createdAt ?? new Date(),
          },
        },
        $pull: {
          isSeen: senderId, // remove sender khỏi seen
        },
      },
    );

    return createMessage;
  } catch (error) {
    console.log('error', error);
  }
};

export const reactMessageService = async ({chatId, messId, react, userId}) => {
  try {
    // update react của tin nhắn
    const message = await Message.findOne({
      chatId,
      _id: messId,
    });

    if (!message) {
      return null;
    }

    // 👉 tìm đúng record: cùng react + cùng user
    const reactItem = message.react.find((r) => r.react === react && r.user.includes(userId));

    if (reactItem) {
      // 🔥 cùng user + cùng react → tăng count
      reactItem.count += 1;
    } else {
      // 🔥 khác user → tạo record mới
      message.react.push({
        react,
        count: 1,
        user: [userId],
      });
    }

    await message.save();

    return message;
  } catch (error) {
    console.log('error', error);
  }
};

export const removeReactMessageService = async ({chatId, messId, userId}) => {
  try {
    const message = await Message.findOne({
      chatId,
      _id: messId,
    });

    if (!message) {
      return null;
    }

    message.react = message.react.filter((r) => !r.user.includes(userId));

    await message.save();

    return message;
  } catch (error) {
    console.log('error', error);
  }
};
