import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  donorName: {
    type: String,
    required: false,
  },
  donorEmail: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 100000,
  },
  paymentId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Donation", donationSchema);