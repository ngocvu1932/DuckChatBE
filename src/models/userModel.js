import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema(
  {
    phone: {type: String},
    username: {type: String, required: true, unique: true},
    fullname: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String},
    birthday: {type: String},
    address: {type: String},
    verificationCode: {type: String},
    isVerified: {type: Boolean, default: false},
    online: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
