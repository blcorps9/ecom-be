import Stripe from "stripe";
import _get from "lodash/get";
import _map from "lodash/map";

import { stripeSecretKey } from "../config";

const stripe = Stripe(stripeSecretKey);

export function makePayment(app, isDev) {
  return async (req, res) => {
    try {
      const user = req.getUser();

      if (user) {
        let customerId = "";
        const { email } = user;
        const { name, paymentMethod, amount } = req.body;

        const sUser = await app.get("orm").Stripe.findOne({ user: email });

        if (sUser && sUser.customerId) {
          customerId = sUser.customerId;
        } else {
          const customer = await stripe.customers.create({
            name,
            email,
          });

          customerId = customer.id;

          await app.get("orm").Stripe.create({
            customerId,
            user: email,
          });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          confirm: true,
          currency: "inr",
          off_session: true,
          customer: customerId,
          payment_method: paymentMethod,
          amount: parseInt(amount * 100),
        });

        return res.returnSuccess(paymentIntent);
      }

      return res.onUnauthorized();
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}
