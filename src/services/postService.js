import Post from '../models/postModel.js';

const postPopulate = [
  {
    path: 'user',
    select: '_id fullname username avatar online',
  },
  {
    path: 'comments.user',
    select: '_id fullname username avatar',
  },
];

export const formatPostResponse = (post, currentUserId) => {
  const postObject = typeof post.toObject === 'function' ? post.toObject() : post;
  const likeIds = postObject.likes ?? [];
  const comments = postObject.comments ?? [];
  const currentUserIdString = currentUserId?.toString();

  return {
    ...postObject,
    likeCount: likeIds.length,
    commentCount: comments.length,
    isLiked: likeIds.some((userId) => userId?.toString() === currentUserIdString),
  };
};

export const createPostService = async ({userId, content, images, visibility}) => {
  const newPost = await Post.create({
    user: userId,
    content,
    images,
    visibility,
    likes: [],
    comments: [],
  });

  return await Post.findById(newPost._id).populate(postPopulate);
};

export const getPostsService = async ({currentUserId, page = 1, limit = 20}) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [posts, total] = await Promise.all([
    Post.find({isDeleted: false}).sort({createdAt: -1}).skip(skip).limit(safeLimit).populate(postPopulate),
    Post.countDocuments({isDeleted: false}),
  ]);

  return {
    posts: posts.map((post) => formatPostResponse(post, currentUserId)),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      hasMore: safePage * safeLimit < total,
    },
  };
};

export const toggleLikePostService = async ({postId, userId}) => {
  const userIdString = userId.toString();
  const post = await Post.findOne({_id: postId, isDeleted: false}).select('likes');

  if (!post) {
    return null;
  }

  const hasLiked = post.likes.some((likeUserId) => likeUserId.toString() === userIdString);

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    hasLiked ? {$pull: {likes: userId}} : {$addToSet: {likes: userId}},
    {new: true},
  ).populate(postPopulate);

  return {
    post: updatedPost,
    liked: !hasLiked,
  };
};

export const commentPostService = async ({postId, userId, content, images = []}) => {
  const newComment = {
    user: userId,
    content: content || '',
    images,
  };

  const updatedPost = await Post.findOneAndUpdate(
    {_id: postId, isDeleted: false},
    {
      $push: {
        comments: {
          $each: [newComment],
          $position: 0, // push comment mới lên đầu
        },
      },
    },
    {new: true},
  ).populate(postPopulate);

  return updatedPost;
};
