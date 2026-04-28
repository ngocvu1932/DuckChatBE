import mongoose, {Schema} from 'mongoose';

const FriendshipsSchema = new Schema(
  {
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    status: {type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending'},
    acceptedAt: {type: Date},
  },
  {
    timestamps: true,
  },
);

//TẠO INDEX Ở ĐÂY
FriendshipsSchema.index({user1: 1, user2: 1}, {unique: true});

const Friendships = mongoose.model('Friendships', FriendshipsSchema);

export default Friendships;
