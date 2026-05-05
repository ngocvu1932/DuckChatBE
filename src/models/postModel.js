import mongoose, {Schema} from 'mongoose';

const CommentSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true, trim: true},
    images: [{type: String, trim: true}],
  },
  {
    timestamps: true,
  },
);

const PostSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, trim: true, default: ''},
    images: [{type: String, trim: true}],
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [CommentSchema],
    visibility: {
      type: String,
      enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
      default: 'PUBLIC',
    },
    isDeleted: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);

PostSchema.index({createdAt: -1});
PostSchema.index({user: 1, createdAt: -1});

const Post = mongoose.model('Post', PostSchema);

export default Post;
