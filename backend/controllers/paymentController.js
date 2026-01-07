import crypto from 'crypto';
import Razorpay from 'razorpay';

import Cart from '../models/Cart.js';
import Donation from '../models/Donation.js';
import Order from '../models/Order.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const amount = cart.items.reduce(
      (total, item) => total + item.productId.price * item.qty,
      0
    );

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount, currency: "INR" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Create order record
      const cart = await Cart.findOne({ userId: req.user.id }).populate(
        "items.productId"
      );
      const orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        sellerId: item.productId.sellerId,
        quantity: item.qty,
        price: item.productId.price,
      }));

      await Order.create({
        userId: req.user.id,
        items: orderItems,
        totalAmount: cart.items.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        ),
        paymentId: razorpay_payment_id,
      });

      // Clear cart after successful payment
      await Cart.findOneAndDelete({ userId: req.user.id });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDonationOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1 || amount > 100000) {
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `donation_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount, currency: "INR" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyDonation = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      donorName,
      donorEmail,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const donationData = {
        amount,
        paymentId: razorpay_payment_id,
      };

      if (req.user) {
        donationData.userId = req.user.id;
      } else {
        donationData.donorName = donorName || "Anonymous";
        donationData.donorEmail = donorEmail;
      }

      await Donation.create(donationData);
      res.json({ success: true, message: "Donation recorded successfully" });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const recentDonations = await Donation.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = totalDonations[0] || { total: 0, count: 0 };

    res.json({
      totalAmount: stats.total,
      totalCount: stats.count,
      recentDonations: recentDonations.map((d) => {
        let donorName = "Anonymous";
        if (d.userId && d.userId.name) {
          donorName = d.userId.name;
        } else if (d.donorName) {
          donorName = d.donorName;
        }
        return {
          amount: d.amount,
          donorName,
          date: d.createdAt,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
