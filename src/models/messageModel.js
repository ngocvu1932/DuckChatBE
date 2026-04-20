import mongoose, {Schema} from 'mongoose';

const MessageSchema = new Schema(
  {
    chatId: {type: String, required: true},
    senderId: {type: String, required: true},
    type: {type: String, required: true},
    content: {type: String},
    isSeen: [{type: String}],
    mediaUrl: {type: String},
    // 🔥 giữ lại messageId từ client
    messageId: {type: String, required: true},
    status: {type: String},
    react: [{type: String}],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
