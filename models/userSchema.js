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
    type: String 
},
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
},
  updated_at: { 
    type: Date
},
  password: { 
    type: String
},
  googleId: {
    type: String,
    unique: true
},
  isBlocked: { 
    type: Boolean, 
    default: false 
},
  cartId: {
  type: Schema.Types.ObjectId  
},
address_id :[
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  }
]
 


});

const userModel = mongoose.model('Users', UsersSchema);

export default userModel;

