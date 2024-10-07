import mongoose from 'mongoose';

const { Schema } = mongoose;


const otp_schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  otp: {
    type: String,  
    required: false,
  },
  refId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m'
  }
});

const otpModel = mongoose.model('otp_schema', otp_schema);

export default otpModel;
