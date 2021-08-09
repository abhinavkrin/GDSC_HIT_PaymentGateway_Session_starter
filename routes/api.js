var express = require('express');
const { verifyUser } = require('../lib/auth');
const admin = require('firebase-admin');
var router = express.Router();
const { razorpayInstance } = require('../lib/RazorpayInstance');
router.route('/products')
.get(async(req,res,next) =>{
  try {
    const products = await admin.firestore().collection('products').where("active","==",true).get();
    res.json(products.docs.map(doc => ({id: doc.id, data: doc.data()})));
  } catch(e){
    next(e);
  }
})

router.route('/products/:productId')
.get(async(req,res,next) => {
  try {
    const product = await admin.firestore().collection('products').doc(req.params.productId).get();
    res.json({id: product.id, data: product.data()});
  } catch(e){
    next(e);
  }
})

router.route('/orders')
.get(verifyUser, async (req,res,next)=> {
  try {
    const orders = await admin.firestore().collection('orders').where("userId","==",req.user.uid).get();
    const ordersWithProducts = [];
    for(let i = 0; i<orders.docs.length; i++){
      const product = await admin.firestore().collection('products').doc(orders.docs[i].data().productId).get();
      ordersWithProducts.push({
        id: orders.docs[i].id,
        data: {
          ...orders.docs[i].data(), product: product.data()
        }
      });
    }
    res.json(ordersWithProducts);
  } catch(e){
    console.error(e);
    next(e);
  }
})
.post(verifyUser, async (req,res,next) => {
  const userId = req.user.uid;
  const {productId} = req.body;
  console.log(productId);
  try {
    const product = (await admin.firestore().collection('products').doc(productId).get()).data();
    if(product === null){
      res.send(404);
      return;
    }
    if(!product.active){
      res.send(404);
      return;
    }
    //create a transaction
    const transaction = {
      createdOn: admin.firestore.Timestamp.now(),
      updatedOn: admin.firestore.Timestamp.now(),
      productId,
      price: product.price,
      userId,
      status: "PENDING",
      orderId: null,
      paymentId: null,
    }
    const transactionRef = await admin.firestore().collection('transactions').add(transaction);
    
    const order = await razorpayInstance.orders.create({
      amount: product.price.amount, 
      currency: product.price.currency, 
      receipt: transactionRef.id, 
      notes: {
        userId,
        productId,
        transactionId: transactionRef.id,
        source: "WEBSITE"
      }
    });
    res.json(order);
  }
  catch(e){
    console.error(e);
    next(e);
  }
})
module.exports = router;
