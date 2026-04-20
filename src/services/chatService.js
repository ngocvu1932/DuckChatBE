import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';

export const createChatOk = async ({user, isGroupChat, chatName, isSeen, groupImgUri}) => {
  const newChat = new Chat({
    user,
    isGroupChat,
    chatName,
    isSeen,
    groupImgUri,
    isPin: false,
    isDelete: false,
    isHide: false,
    lastMessage: {
      messageId: '',
      sender: '',
      content: '',
      timestamp: Date.now(),
    },
  });

  return await newChat.save();
};

export const createMessage = async ({chatId, senderId, type, content, isSeen, mediaUrl, messageId, status}) => {
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
