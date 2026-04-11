import mongoose, {Schema} from 'mongoose';

const LastMessageSchema = new Schema(
  {
    messageId: {type: String},
    sender: {type: String},
    content: {type: String},
    timestamp: {type: Date, default: Date.now},
  },
  {_id: false}
);

const ChatSchema = new Schema(
  {
    user: [{type: String, required: true}],
    isGroupChat: {type: Boolean, default: false},
    chatName: {type: String},
    isSeen: [{type: String}],
    groupImgUri: {type: String},
    isPin: {type: Boolean, default: false},
    isDelete: {type: Boolean, default: false},
    isHide: {type: Boolean, default: false},
    lastMessage: {type: LastMessageSchema},
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;
