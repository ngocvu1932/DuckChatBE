import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Đọc các biến môi trường
dotenv.config();

export const generateAccessToken = (userId) => {
  return jwt.sign({userId: userId}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({userId: userId}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
