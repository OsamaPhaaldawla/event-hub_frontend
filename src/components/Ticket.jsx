import { QRCodeCanvas } from "qrcode.react";

export default function Ticket({ ticketCode }) {
  return (
    <div className="bg-gray-50 p-4 border border-black rounded-2xl mt-6">
      <p className="">Ticket Code: {ticketCode}</p>
      <QRCodeCanvas className="mx-auto mt-4" value={ticketCode} size={180} />
    </div>
  );
}
