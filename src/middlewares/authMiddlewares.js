import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return res.status(401).json({status: false, message: 'Token không tồn tại hoặc đã hết hạn!'});
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: 'Token không hợp lệ!',
      });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: 'Token đã hết hạn!',
      });
    } else {
      return res.status(500).json({
        status: false,
        message: 'Đã xảy ra lỗi nội bộ!',
        error: err.message,
      });
    }
  }
};

export default authMiddleware;
