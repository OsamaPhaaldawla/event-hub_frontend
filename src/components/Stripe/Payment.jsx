import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { stripePromise } from "./stripe";

export default function Payment() {
  const location = useLocation();
  const { amount, id, mode, formData } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!amount || !id) return;

    fetch("http://localhost:3000/api/payments/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }), // amount should be in **cents**
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => console.error("Error fetching client secret:", err));
  }, [amount, id]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="stripe-container">
      <main>
        <div className="flex justify-between">
          <h1>Complete Your Payment</h1>
          <span>${amount / 100}</span>
        </div>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm id={id} mode={mode} formData={formData} />
          </Elements>
        )}
      </main>
    </div>
  );
}
