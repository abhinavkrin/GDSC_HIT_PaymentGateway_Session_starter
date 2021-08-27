const router = require('express').Router();
const razorpay = require('razorpay');
const admin = require('firebase-admin');
router.route('/razorpay-webhook')
.post(async(req,res,next) =>{
    // verify webhook signature
    // check event is order.paid
    // check if order source is our website
    // Extract userId, productId, transactionId
    // If transaction is not already processed, Do it and create an Order in our DB.
    const body =  req.rawBody;
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    try {
       
    } catch(e) {
       console.error(e);
       next(e);
   }
})

module.exports = router;