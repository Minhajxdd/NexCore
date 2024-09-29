import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  reviews: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      username: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date },
    },
  ],
});

export default mongoose.model("Review", reviewSchema);
 