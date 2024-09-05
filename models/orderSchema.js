import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchmea = new Schema({
    user_id: { 
        type: Schema.Types.ObjectId,
        required: true
    },
    products:[{
      product_id: {
        type: Schema.Types.ObjectId,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    orderedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    addressId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Card', 'Bank'], 
        default: 'pending',
        required: true
    },
    note: String

});


const orderModel = mongoose.model('Orders', orderSchmea);

export default orderModel;