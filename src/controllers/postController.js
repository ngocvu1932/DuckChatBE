import User from '../models/userModel.js';
import {createPostService, formatPostResponse, getPostsService} from '../services/postService.js';

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
    const {page, limit} = req.query;
    const result = await getPostsService({currentUserId: userId, page, limit});

    return res.status(200).json({
      success: true,
      message: 'Lay danh sach bai post thanh cong!',
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Loi server!',
    });
  }
};
