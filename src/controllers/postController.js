import User from '../models/userModel.js';
import mongoose from 'mongoose';
import {
  commentPostService,
  createPostService,
  formatPostResponse,
  getPostsByUserIdService,
  getPostsService,
  toggleLikePostService,
} from '../services/postService.js';

export const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {content = '', images = [], visibility = 'PUBLIC'} = req.body;
    const trimmedContent = content.trim();

    if (!trimmedContent && (!Array.isArray(images) || images.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Post can co noi dung hoac hinh anh!',
      });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'images phai la mang URL!',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Nguoi dung khong ton tai!',
      });
    }

    const post = await createPostService({
      userId,
      content: trimmedContent,
      images,
      visibility,
    });

    return res.status(201).json({
      success: true,
      message: 'Tao bai post thanh cong!',
      data: formatPostResponse(post, userId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Loi server!',
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {cursor, limit} = req.query;
    const result = await getPostsService({currentUserId: userId, cursor, limit});

    return res.status(200).json({
      success: true,
      data: result.posts,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Loi server!',
    });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const {userId} = req.params;
    const {cursor, limit} = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId la bat buoc!',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'userId khong hop le!',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Nguoi dung khong ton tai!',
      });
    }

    const result = await getPostsByUserIdService({
      targetUserId: userId,
      currentUserId,
      cursor,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.posts,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Loi server!',
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {postId} = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'postId la bat buoc!',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: 'postId khong hop le!',
      });
    }

    const result = await toggleLikePostService({postId, userId});

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Post khong ton tai!',
      });
    }

    return res.status(200).json({
      success: true,
      message: result.liked ? 'Like bai post thanh cong!' : 'Bo like bai post thanh cong!',
      data: formatPostResponse(result.post, userId),
    });
  } catch (er) {
    console.error(er);
    return res.status(500).json({
      success: false,
      message: 'Loi server!',
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {postId, content, images} = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'postId la bat buoc!',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: 'postId khong hop le!',
      });
    }

    if (!content && (!images || images.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Noi dung comment khong duoc rong!',
      });
    }

    const result = await commentPostService({
      postId,
      userId,
      content,
      images,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Post khong ton tai!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Comment thanh cong!',
      data: formatPostResponse(result, userId),
    });
  } catch (er) {
    console.error(er);
    return res.status(500).json({
      success: false,
      message: 'Loi server!',
    });
  }
};
