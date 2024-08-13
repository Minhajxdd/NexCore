import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define your schema
const otp_schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,  
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1m'
  }
});

const otpModel = mongoose.model('otp_schema', otp_schema);

export default otpModel;
