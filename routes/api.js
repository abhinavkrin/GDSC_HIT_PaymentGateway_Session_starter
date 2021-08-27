var express = require('express');
const { verifyUser } = require('../lib/auth');
const admin = require('firebase-admin');
var router = express.Router();
const { razorpayInstance } = require('../lib/RazorpayInstance');
router.route('/products')
//send list of active products
.get(async(req,res,next) =>{
  try {
    res.send("hello from " + req.originalUrl);
  } catch(e){
    next(e);
  }
})

router.route('/products/:productId')
//send details of product with the given productId
.get(async(req,res,next) => {
  try {
    res.send("hello from " + req.originalUrl);
  } catch(e){
    next(e);
  }
})

router.route('/orders')
//send completed orders of the current user
.get(verifyUser, async (req,res,next)=> {
  try {
    res.send("hello from " + req.originalUrl);
    //fetch orders from DB 

    //fetch products related with the orders

  } catch(e){
    console.error(e);
    next(e);
  }
})

//create new order for the given product
.post(verifyUser, async (req,res,next) => {
  res.send("hello from " + req.originalUrl);
  
  const userId = req.user.uid;
  const {productId} = req.body;

  try {
    //fetch product from DB and check if available
    
    //create a transaction and add it to DB
    
    //create order on razorpay
    
    //send order details received from razorpay

    // res.json(order);
  }
  catch(e){
    console.error(e);
    next(e);
  }
})
module.exports = router;
