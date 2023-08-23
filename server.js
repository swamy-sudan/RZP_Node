'use strict'

const express = require('express')
var { validatePaymentVerification, validateWebhookSignature } = require('./node_modules/razorpay/dist/utils/razorpay-utils');
const app = express()
const port = 3000
const bodyparser = require("body-parser");
const Razorpay = require('razorpay')
app.use(require("body-parser").json());
var instance = new Razorpay({
    key_id: '<Key_ID',
    key_secret: '<Secret>'
  })

app.get('/', (req, res) => {
    res.sendFile("standard.html", { root: __dirname });
})


app.post('/create/orderId', (req, res) => {
  console.log("create orderId request",req.body);
  
  var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
   // receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    
    if(err){
      console.error('exception while generating OrderId ',err);
      throw new Error(err);
    }
    else
    {
      console.log('order generated :',order);
    res.send( {orderId : order.id }) ;
    }
  });

 

})


app.post("/api/payment/verify",(req,res)=>{
      var razorpayOrderId = req.body.response.razorpay_order_id;
      var razorpayPaymentId = req.body.response.razorpay_payment_id;
     var signature = req.body.response.razorpay_signature;
     var secret = "6Gu7IbFgilFjdoljKNvD5vIq";

     var response = {"signatureIsValid":"false"}

     if(validatePaymentVerification({"order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret)){
      response={"signatureIsValid":"true"}
     }



     res.send(response);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
