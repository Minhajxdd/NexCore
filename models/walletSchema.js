import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const WalletSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  balance_amount: { type: Number, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true },
  transactions: [
    {
      amount: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be below zero'],
      },
      transaction_type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
      },
      description: {
        type: String,
        required: false
      },
      transaction_date: {
        type: Date,
        default: Date.now
      }
    }
  ],
});


// Update `updated_at` before every save
WalletSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;

