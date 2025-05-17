import { Link, useLoaderData } from "react-router";
import { jwtDecode } from "jwt-decode";
import { Sparkles } from "lucide-react";

const MyEvents = () => {
  const events = useLoaderData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-x-2">
        My Events <Sparkles className="text-amber-600" />
      </h1>
      {events.length === 0 ? (
        <p>No events yet. Go create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-200"
            >
              <img
                src={
                  event.image || "https://placehold.co/600x400?text=No+Image"
                }
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.subtitle}</p>
                <p className="text-sm text-gray-500">
                  📍 {event.venueName}, {event.venueLocation}
                </p>
                <p className="text-sm text-gray-500">
                  📅 {event.date} at 🕒 {event.time}
                </p>

                <div className="mt-4">
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-block text-blue-600 font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;

export const loader = async () => {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);
  const res = await fetch(
    `http://localhost:3000/events/hoster/${user.userId}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw {
      message: "Failed to fetch events.",
    };
  } else {
    return res;
  }
};
