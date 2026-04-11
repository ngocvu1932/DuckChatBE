import mongoose, {Schema} from 'mongoose';

const MessageSchema = new Schema(
  {
    chatId: {type: String, required: true},
    senderId: {type: String, required: true},
    type: {type: String, required: true},
    content: {type: String},
    isSeen: [{type: String}],
    mediaUrl: {type: String},
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
