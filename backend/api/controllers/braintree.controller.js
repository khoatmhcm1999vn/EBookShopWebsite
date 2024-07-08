// const User = require("../models/userModel");
import braintree from "braintree";
import dotenv from "dotenv";
dotenv.config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // Production
  merchantId: process.env.BRAINTREE_MERCHANT_ID || "49yxsy54rnngvh4c",
  publicKey: process.env.BRAINTREE_PUBLIC_KEY || "6s54sb2zrf25rx7j",
  privateKey: process.env.BRAINTREE_PRIVATE_KEY || "38522341bbc2451000da4476718b0e82",
});

export const generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(response);
    }
  });
};
export const processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  // charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.status(200).json(result);
      }
    }
  );
};
