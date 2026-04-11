import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return res.status(401).json({status: 401, statusCode: 400, message: 'Token không tồn tại hoặc đã hết hạn!'});
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 401,
        statusCode: 400,
        message: 'Token không hợp lệ!',
      });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 401,
        statusCode: 400,
        message: 'Token đã hết hạn!',
      });
    } else {
      return res.status(500).json({
        status: 500,
        statusCode: 500,
        message: 'Đã xảy ra lỗi nội bộ!',
        error: err.message,
      });
    }
  }
};

export default authMiddleware;
