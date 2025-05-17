import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate, useSubmit } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function CheckoutForm({ id, mode, formData }) {
  const submit = useSubmit();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success", // Or your own success page
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment error:", error.message);
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      //   Send ticket reservation request
      if (mode === "event") {
        fetch("http://localhost:3000/api/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: id,
            userId: user.userId,
            paymentStatus: "paid",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Ticket reserved:", data);
            navigate("/payment-success", {
              state: { ticketCode: data.ticketCode },
            });
            toast.success("Payment Successful 🎉");
          })
          .catch((err) => console.error("Ticket reservation failed", err));
      } else if (mode === "venue") {
        const newFormData = new FormData();

        for (const key in formData) {
          newFormData.append(key, formData[key]);
        }
        console.log("reached the submitting place!!!!!");
        submit(newFormData, {
          method: "POST",
          encType: "multipart/form-data",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
}
