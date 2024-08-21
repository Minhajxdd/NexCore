import mongoose from 'mongoose';

const {Schema} = mongoose;


const productSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true, 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  category_name: {
    type: String,
    required: true
  },
  size_field: { 
    type: String 
  },
  size_options: [{ 
    type: String  
  }],
  images: [{ 
    type: String, 
    required: true  
  }],
  original_price: { 
    type: Number, 
    required: true 
  },
  discounted_price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
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
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
});
  
const productModel = mongoose.model('products', productSchema);

export default productModel;