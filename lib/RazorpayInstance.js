const Razorpay = require('razorpay');

exports.razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  headers: {
    "X-Razorpay-Account": process.env.RAZORPAY_MERCHANT_ID
  }
});
