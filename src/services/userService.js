import UserModel from '../models/userModel.js';

export const createUser = async ({username, password, email, verificationCode}) => {
  const newUser = new UserModel({
    username,
    email,
    password,
    address: '',
    phone: '',
    avatar:
      'https://res.cloudinary.com/ngocvu1932/image/upload/v1737704100/chatWithVunn/avtUser/jko4oxxuprjlse9dz2mu.jpg',
    fullname: username,
    verificationCode,
    isVerified: false,
    online: false,
  });

  return await newUser.save();
};

export const updateUser = async (userId, data) => {
  return await UserModel.findByIdAndUpdate(userId, data, {new: true});
};
