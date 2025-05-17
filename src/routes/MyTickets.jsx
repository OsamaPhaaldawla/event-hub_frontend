import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user.userId;

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${userId}/tickets`)
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, [userId]);

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hour, minute] = timeStr.split(":");
    const time = new Date(date);
    time.setHours(hour, minute);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(time);

    return { formattedDate, formattedTime };
  };

  // Group tickets by event_id
  const groupTickets = (tickets) => {
    const grouped = {};

    tickets.forEach((ticket) => {
      const { formattedDate, formattedTime } = formatDateTime(
        ticket.date,
        ticket.time
      );

      const formattedTicket = {
        ...ticket,
        date: formattedDate,
        time: formattedTime,
      };

      if (!grouped[ticket.event_id]) {
        grouped[ticket.event_id] = {
          ...formattedTicket,
          quantity: 1,
          ticket_codes: [ticket.ticket_code],
        };
      } else {
        grouped[ticket.event_id].quantity += 1;
        grouped[ticket.event_id].ticket_codes.push(ticket.ticket_code);
      }
    });

    return Object.values(grouped);
  };

  const groupedTickets = groupTickets(tickets);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">🎟️ My Tickets</h2>
      <div className="grid gap-6">
        {groupedTickets.map((ticket) => (
          <div
            key={ticket.event_id}
            className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 relative"
          >
            {/* Quantity badge */}
            {ticket.quantity > 1 && (
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {ticket.quantity}
              </span>
            )}

            <h3 className="text-xl font-semibold text-indigo-600">
              {ticket.title}
            </h3>
            <p className="text-gray-700">📅 {ticket.date}</p>
            <p className="text-gray-700">🕒 {ticket.time}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate(`/events/${ticket.event_id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
              >
                View Event
              </button>
              <button
                onClick={() => setSelectedTicket(ticket)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition"
              >
                Show QR Code{ticket.quantity > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full relative">
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
              🎫 Ticket QR Code{selectedTicket.quantity > 1 ? "s" : ""}
            </h3>
            <div className="flex flex-col items-center gap-4 py-4">
              {selectedTicket.ticket_codes.map((code, index) => (
                <div key={code} className="flex flex-col items-center">
                  {selectedTicket.quantity > 1 && (
                    <p className="text-sm text-gray-500 mb-1">
                      Ticket #{index + 1}
                    </p>
                  )}
                  <QRCodeCanvas value={code} size={180} />
                  <p className="text-center text-gray-600 mt-2 text-sm">
                    Code: <strong>{code}</strong>
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router";

// export default function MyTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const userId = user.userId;

//   useEffect(() => {
//     fetch(`http://localhost:3000/api/users/${userId}/tickets`)
//       .then((res) => res.json())
//       .then((data) => setTickets(data));
//   }, [userId]);

//   const formatDateTime = (dateStr, timeStr) => {
//     const date = new Date(dateStr);
//     const [hour, minute] = timeStr.split(":");
//     const time = new Date(date);
//     time.setHours(hour, minute);

//     const formattedDate = new Intl.DateTimeFormat("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     }).format(date);

//     const formattedTime = new Intl.DateTimeFormat("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     }).format(time);

//     return { formattedDate, formattedTime };
//   };

//   const newTickets = tickets.map((item) => {
//     const { formattedDate, formattedTime } = formatDateTime(
//       item.date,
//       item.time
//     );
//     return { ...item, date: formattedDate, time: formattedTime };
//   });

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold mb-6 text-center">🎟️ My Tickets</h2>
//       <div className="grid gap-6">
//         {newTickets.map((ticket) => (
//           <div
//             key={ticket.id}
//             className="bg-white p-6 shadow-lg rounded-xl border border-gray-200"
//           >
//             <h3 className="text-xl font-semibold text-indigo-600">
//               {ticket.title}
//             </h3>
//             <p className="text-gray-700">📅 {ticket.date}</p>
//             <p className="text-gray-700">🕒 {ticket.time}</p>
//             <div className="mt-4 flex gap-3">
//               <button
//                 onClick={() => navigate(`/events/${ticket.event_id}`)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
//               >
//                 View Event
//               </button>
//               <button
//                 onClick={() => setSelectedTicket(ticket)}
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition"
//               >
//                 Show QR Code
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Modal */}
//       {selectedTicket && (
//         <div className="fixed inset-0 bg-black/80 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full relative">
//             <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
//               🎫 Ticket QR Code
//             </h3>
//             <div className="flex justify-center py-4">
//               <QRCodeCanvas value={selectedTicket.ticket_code} size={200} />
//             </div>
//             <p className="text-center text-gray-600 mt-4">
//               Ticket Code: <strong>{selectedTicket.ticket_code}</strong>
//             </p>
//             <button
//               onClick={() => setSelectedTicket(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//             >
//               ✖
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
