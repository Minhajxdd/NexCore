import mongoose from "mongoose";

const { Schema } = mongoose;

const offerSchema = new mongoose.Schema({
    offer_title: {
      type: String,
      required: true,
    },
    offer_type: {
      type: String,
      required: true,
      enum: ['Category', 'Products']
    },
    offer_available:[
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    discount_percentage: {
      type: Number,
      required: true,
    },
    exp_date: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date
    }
  });

  offerSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });
  
  
  const offerModel = mongoose.model("offer", offerSchema);
  export default offerModel;
  