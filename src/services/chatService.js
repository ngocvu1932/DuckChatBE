import Chat from '../models/chatModel.js';

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
