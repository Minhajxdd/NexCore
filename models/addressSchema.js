import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchema = new mongoose.Schema({
    first_name: { 
      type: String, 
      required: true 
      },
    last_name: { 
      type: String, 
      required: true 
      },
    company: { 
      type: String
      },
    street: {
      type: String,
      required: true
    },
    land_mark: {
      type: String,
      required: true
    },
    optional_message: {
      type: String
    },
    zipcode: {
      type: Number,
      required: true
    },
    city_town: { 
      type: String, 
      required: true 
      },
    state: {
      type: String,
      required: true
    },
    phone_no: { 
      type: Number, 
      required: true 
      },
    email: {
      type: String,
    },
    updated_at: { 
      type: Date,
    },
    created_at: { 
      type: Date,
      default: Date.now, 
      required: true 
    },
    user_id: { 
      type: Schema.Types.ObjectId,
      required: true
    },
  });


const address = mongoose.model('address', addressSchema);

export default address;
