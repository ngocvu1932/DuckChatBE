import User from '../models/userModel.js';
import {createUser, updateUser} from '../services/userService.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from '../utils/authUtils.js';
import sendMail from '../utils/sendMail.js';
import {createChatOk} from '../services/chatService.js';

export const sendMailVerification = async (req, res) => {
  try {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (user) {
      return res.status(400).json({success: false, message: 'Email đã tồn tại!'});
    }

    if (!email) {
      return res.status(400).json({success: false, message: 'Email bắt buộc!'});
    }

    const verificationCode = crypto.randomBytes(4).toString('hex');

    await sendMail(
      email,
      'Chat App Verification',
      `Your code: ${verificationCode} \n\nPlease do not share with anyone!`,
    );

    return res.status(200).json({success: true, message: 'Gửi mã xác thực thành công!', verificationCode});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Lỗi server!'});
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const {username, email, verifyCode} = req.body;

    if (!email || !verifyCode || !username) {
      return res.status(400).json({success: false, message: 'Email và mã xác thực bắt buộc nhập!'});
    }

    const user = await User.findOne({username, email});

    if (!user) {
      return res.status(400).json({success: false, message: 'User không tồn tại!'});
    }

    const isMatch = await bcrypt.compare(verifyCode, user.verificationCode);

    if (!isMatch) {
      return res.status(400).json({success: false, message: 'Mã xác thực không chính xác!'});
    }

    user.isVerified = true;
    user.verificationCode = '';

    await user.save();

    delete user.password;
    delete user.__v;

    return res.status(200).json({success: true, message: 'Xác thực email thành công!', data: user});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: error});
  }
};

export const registerUser = async (req, res) => {
  const {username, password, email} = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!username || !password || !email) {
      return res.status(400).json({success: false, message: 'Các trường bắt buộc!!'});
    }

    const verificationCode = crypto.randomBytes(4).toString('hex');
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({username, email});

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({success: false, message: 'Tài khoản đã tồn tại!'});
      }

      const update = await updateUser(existingUser._id, {
        verificationCode: hashedVerificationCode,
        password: hashedPassword,
      });
      const userRes = update.toObject();
      delete userRes.password;
      delete userRes.verificationCode;
      delete userRes.__v;

      await sendMail(
        email,
        'Chat App Verification',
        `Your code: ${verificationCode} \n\nPlease do not share with anyone!`,
      );

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công!',
        data: userRes,
      });
    } else {
      // Nếu không tồn tại, kiểm tra từng trường để tránh trường hợp username/email trùng lặp
      const existingUsername = await User.findOne({username});
      const existingEmail = await User.findOne({email});

      if (existingUsername) {
        return res.status(400).json({success: false, message: 'Tên người dùng đã tồn tại!'});
      }

      if (existingEmail) {
        return res.status(400).json({success: false, message: 'Email đã tồn tại!'});
      }

      // Tạo user mới
      const newUser = await createUser({
        username,
        password: hashedPassword,
        email,
        verificationCode: hashedVerificationCode,
      });
      const userRes = newUser.toObject();
      delete userRes.password;
      delete userRes.verificationCode;
      delete userRes.__v;

      await sendMail(
        email,
        'Chat App Verification',
        `Your code: ${verificationCode} \n\nPlease do not share with anyone!`,
      );

      return res.status(200).json({
        success: true,
        message: 'Tạo tài khoản thành công',
        user: userRes,
      });
    }
  } catch (error) {
    return res.status(500).json({success: false, message: error});
  }
};

export const loginUser = async (req, res) => {
  const {username, password} = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({success: false, message: 'Các trường bắt buộc!'});
    }
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({username});

    if (!user) {
      return res.status(400).json({success: false, message: 'Không tồn tại người dùng!'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({success: false, message: 'Tên hoặc mật khẩu không chính xác!'});
    }

    if (user.isVerified === false) {
      return res.status(400).json({success: false, message: 'Tài khoản chưa được xác thực!'});
    }

    // upload online
    user.online = true;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userRes = user.toObject();
    delete userRes.password;
    delete userRes.verificationCode;
    delete userRes.__v;

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {...userRes, accessToken, refreshToken},
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false, message: err});
  }
};

export const refreshToken = async (req, res) => {
  try {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      return res.status(400).json({success: false, message: 'Bắt buộc nhập!'});
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(400).json({success: false, message: 'Token không hợp lệ!'});
    }

    const accessToken = generateAccessToken(decoded.userId);

    return res.status(200).json({success: true, message: 'Tạo token thành công!', data: {accessToken}});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: error});
  }
};

export const getProfile = async (req, res) => {
  try {
    // Lấy userId từ payload của token đã giải mã trong middleware
    const userId = req.user.userId;

    // Truy vấn thông tin người dùng từ cơ sở dữ liệu
    const user = await User.findById(userId).select('-password -__v -verificationCode'); // Loại bỏ trường password và __v

    if (!user) {
      return res.status(400).json({success: false, message: 'Người dùng không tồn tại!'});
    }

    // Trả về thông tin người dùng
    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin người dùng thành công!',
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false, message: err});
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({success: false, message: 'Người dùng không tồn tại!'});
    }

    user.online = false;
    await user.save();

    return res.status(200).json({success: true, message: 'Đăng xuất thành công!'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: error});
  }
};
