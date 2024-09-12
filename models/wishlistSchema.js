import mongoose from 'mongoose';

const { Schema } = mongoose;

const wishlistSchmea = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        sparse: true
    }],
    created_at: {
        type: Date, 
        default: Date.now,
        required: true
    },
    updated_at: {
        type: Date,
    },
});

const wishlistModel = mongoose.model('wishlist', wishlistSchmea);

export default wishlistModel;