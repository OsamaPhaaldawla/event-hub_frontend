import { Link, useLoaderData } from "react-router";
import ImageGall from "../components/ImageGall";
import AvailableSlots from "../UI/AvailableSlots";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function VenueDetails() {
  const venue = useLoaderData();
  const { user } = useAuth();

  const isTheVendorOwner =
    user?.role === "vendor" && venue.owner_id === user.userId;

  return (
    <>
      {venue && (
        <div className="container mx-auto px-6 py-10">
          <div className="flex justify-between items-center relative">
            <ImageGall images={venue.images} />
          </div>
          <div className="relative lg:max-w-4/5 mx-auto">
            {isTheVendorOwner && (
              <Link
                to={
                  isTheVendorOwner ? `/vendor/edit-venue/${venue.id}` : "login"
                }
                className="absolute right-8 top-3 border border-blue-600 rounded-lg px-2 py-1 cursor-pointer text-xl hover:bg-blue-600 hover:text-white duration-300"
                type="button"
              >
                Edit
              </Link>
            )}
            <div className="px-6 mt-6">
              <h1 className="text-3xl font-bold mt-6 mb-6">{venue.name}</h1>
              <a
                href={venue.url}
                target="_blank"
                className="text-blue-600 underline text-xl"
              >
                {venue.location}
              </a>
              <div className="flex gap-4 my-5">
                <div className="flex items-center gap-2 text-lg">
                  <FaUsers className="w-5 h-5 text-blue-600" />{" "}
                  <span>
                    {venue.capacity}{" "}
                    {venue.capacity === 1 ? "person" : "people"} max
                  </span>
                </div>
                <div className="text-xl font-bold">
                  {venue.price > 0 && (
                    <>
                      ${venue.price}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        /hour
                      </span>
                    </>
                  )}
                </div>
              </div>
              {venue.availableSlots.length > 0 ? (
                <AvailableSlots
                  availableSlots={venue.availableSlots}
                  venueId={venue.id}
                  isTheVendorOwner={isTheVendorOwner}
                />
              ) : (
                <p className="text-lg underline text-rose-600">
                  Sorry, There is no availableSlots for this venue
                </p>
              )}
              <div className="mt-5">
                <h3 className="text-xl font-bold mb-2">Description:</h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {venue.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const loader = async ({ params }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:3000/venues/${params.venueId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw { message: "Could not fetch venue details" };
  } else {
    const data = await res.json();
    return data;
  }
};
