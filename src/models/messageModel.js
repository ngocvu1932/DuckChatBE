import mongoose, {Schema} from 'mongoose';

const reactMessageSchema = new Schema(
  {
    react: {type: String},
    count: {type: Number}, // để number
    user: [{type: String}], // để number
  },
  {_id: false},
);

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
    react: [reactMessageSchema],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
