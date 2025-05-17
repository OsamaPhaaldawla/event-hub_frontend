import { Link, useLoaderData } from "react-router";
import { jwtDecode } from "jwt-decode";
import { Sparkles } from "lucide-react";

const MyVenues = () => {
  const venues = useLoaderData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-x-2">
        My Venues <Sparkles className="text-amber-600" />
      </h1>
      {venues.length === 0 ? (
        <p>You don't have a venue. Go add one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {venue.image ? (
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  No image available
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold">{venue.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      venue.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : venue.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {venue.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-1">
                  📍 {venue.location}
                </p>

                {venue.price && (
                  <p className="text-sm text-gray-500">
                    💰 ${venue.price} / day
                  </p>
                )}

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {venue.description}
                </p>

                <div className="mt-4">
                  <Link
                    to={`/venues/${venue.id}`}
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

export default MyVenues;

export const loader = async () => {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const res = await fetch(
    `http://localhost:3000/venues/vendor/${user.userId}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw {
      message: "Failed to fetch venues.",
    };
  } else {
    return res;
  }
};
