import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { FaSpinner } from "react-icons/fa";
import { FaRegBuilding } from "react-icons/fa6";

const PendingVenues = () => {
  const pendingVenues = useLoaderData();
  const [venues, setVenues] = useState(pendingVenues);
  const [loadingId, setLoadingId] = useState(null);
  const [showModal, setShowModal] = useState({
    visible: false,
    venueId: null,
    action: null,
  });
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const updateVenueStatus = async (venueId, status) => {
    setLoadingId(venueId);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:3000/venues/${venueId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update status to ${status}`);
      }

      setVenues((prev) => prev.filter((v) => v.id !== venueId));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingId(null);
      setShowModal({ visible: false, venueId: null, action: null });
    }
  };

  const openConfirmation = (venueId, action) => {
    setShowModal({
      visible: true,
      venueId,
      action,
    });
  };

  const closeConfirmation = () => {
    setShowModal({
      visible: false,
      venueId: null,
      action: null,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Venues</h2>
        {venues.length > 0 && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {venues.length} pending
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <div
              key={venue.id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {venue.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Location:</span>{" "}
                    {venue.location}
                  </p>
                </div>
                <Link
                  to={`/venues/${venue.id}`}
                  className="text-sm px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Capacity:</span>{" "}
                    {venue.capacity.toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Price:</span> $
                    {venue.price.toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize text-yellow-600 font-medium">
                      {venue.status}
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-3 text-gray-700">
                <span className="font-medium">Description:</span>{" "}
                {venue.description}
              </p>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => openConfirmation(venue.id, "approved")}
                  disabled={loadingId === venue.id}
                  className={`px-4 py-2 rounded-md text-white ${
                    loadingId === venue.id
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } transition-colors flex items-center`}
                >
                  {loadingId === venue.id && showModal.action === "approved" ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  onClick={() => openConfirmation(venue.id, "rejected")}
                  disabled={loadingId === venue.id}
                  className={`px-4 py-2 rounded-md text-white ${
                    loadingId === venue.id
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } transition-colors`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-4">
              <FaRegBuilding className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No Pending Venues
            </h3>
            <p className="text-gray-500">All venues have been processed</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm{" "}
              {showModal.action === "approved" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              {showModal.action === "approved" ? "approve" : "reject"} this
              venue? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmation}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateVenueStatus(showModal.venueId, showModal.action)
                }
                className={`px-4 py-2 rounded-md text-white ${
                  showModal.action === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } transition-colors`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingVenues;

export const loader = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/venues/pending", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pending venues");
  }

  return await res.json();
};
