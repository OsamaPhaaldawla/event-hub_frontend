import { useLocation } from "react-router";
import Ticket from "../Ticket";

export default function PaymentSuccess() {
  const location = useLocation();
  const ticketCode = location.state?.ticketCode;

  return (
    <div className="flex flex-col items-center justify-center mt-3">
      <h1 className="text-2xl">
        Thanks for your purchase! Here is your ticket:
      </h1>
      {ticketCode ? (
        <Ticket ticketCode={ticketCode} />
      ) : (
        <p>Ticket code not found.</p>
      )}
    </div>
  );
}
