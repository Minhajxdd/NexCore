import mongoose from "mongoose";

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: {
     type: String, 
     required: true,
     unique: true, 
    },
  full_name: { 
    type: String, 
    required: true 
},
  phone_number: { 
    type: String, 
    required: true 
},
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
},
  updated_at: { 
    type: Date 
},
  password: 
  { 
    type: String, 
    required: true 
},
  isBlocked: { 
    type: Boolean, 
    default: false 
}
});

const userModel = mongoose.model('Users', UsersSchema);

export default userModel;

