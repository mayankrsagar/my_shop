import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);