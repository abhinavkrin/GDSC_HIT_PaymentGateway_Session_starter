const router = require('express').Router();
const razorpay = require('razorpay');
const admin = require('firebase-admin');
router.route('/razorpay-webhook')
.post(async(req,res,next) =>{
    const body =  req.rawBody;
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    try {
        if(!razorpay.validateWebhookSignature(body,signature,secret)){
        //invalid valid webhook signature
        res.sendStatus(401);
        return;
        }
        if(req.body.event === 'order.paid'){
            const order = req.body.payload.order.entity;
            const payment = req.body.payload.payment.entity;
            if(order.notes.source !== "WEBSITE"){
                res.sendStatus(200);
                return;
            }

            const userId = order.notes.userId;
            const productId = order.notes.productId;
            const transactionId = order.notes.transactionId;
            
            const transactionRef = admin.firestore().collection('transactions').doc(transactionId);
            const orderRef = admin.firestore().collection('orders').doc(order.id);
        
            const success = await admin.firestore().runTransaction( async t =>{
                const trans = await t.get(transactionRef);
                if(trans.data().status === "PAID") 
                    return true;
                await t.update(transactionRef,{
                    status: "PAID", 
                    updatedOn: admin.firestore.Timestamp.now(),
                    orderId: order.id,
                    paymentId: payment.id
                });
                await t.set(orderRef,{
                    transactionId,
                    createdOn: admin.firestore.Timestamp.now(),
                    productId,
                    price: {
                        amount: order.amount,
                        currency: order.currency
                    },
                    userId,
                    paymentId: payment.id
                });
                return true;
            });

            if(success !==  true){
                res.sendStatus(501);
                return;
            }
        }
        res.sendStatus(200);
   } catch(e) {
       console.error(e);
       next(e);
   }
})

module.exports = router;