import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema({

    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    products_id: [
        { 
            type: Schema.Types.ObjectId, 
        }],
    isDeleted: { 
        type: Boolean, 
        default: false 
        },
    created_at: { 
        type: Date,
        default: Date.now,
        immutable: true
    },
    updated_at: { 
        type: Date
    },
  
  });
  


const categoryModel = mongoose.model('Categories', CategorySchema);

export default categoryModel;
