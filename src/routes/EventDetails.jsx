import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";

import { LuCalendarCheck2 } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { formatDate } from "../constants";
import { useAuth } from "../context/AuthContext";
import ImageGall from "../components/ImageGall";
import { PiChairFill } from "react-icons/pi";
import Button from "../UI/Button";
import QRScanner from "../components/QRScanner";
import { toast } from "react-toastify";

export default function EventDetails() {
  const event = useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const date = new Date(event.date);

  const options = {
    weekday: "long", // e.g. Saturday
    month: "long", // e.g. May
    day: "numeric", // e.g. 10
  };

  const formattedDate = date.toLocaleDateString("en-US", options);

  const handleBookClick = (reserve = false) => {
    const amountInCents = event.price * 100;
    if (reserve) {
      fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
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
          toast.success("Reserved Successful 🎉");
        })
        .catch((err) => console.error("Ticket reservation failed", err));
    } else {
      navigate("/payment", {
        state: {
          amount: amountInCents,
          id: event.id,
          mode: "event",
        },
      });
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReserveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    handleBookClick(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  event.faqs =
    typeof event.faqs === "string" ? JSON.parse(event.faqs) : event.faqs;
  event.tags =
    typeof event.tags === "string" ? JSON.parse(event.tags) : event.tags;
  return (
    <>
      <div className="w-full image-container mt-8">
        <div className="max-w-4/5 mx-auto mt-1">
          <ImageGall images={event.images} classes="h-[470px]" blur_back />
        </div>
        {event ? (
          <div className="container relative flex max-w-4/5 mx-auto py-10 gap-x-6">
            <div className="relative flex w-3/4">
              <div className="w-full items-center">
                <span className="font-semibold text-xl mb-4">
                  {formattedDate}
                </span>
                <h1 className="text-6xl md:text-5xl font-bold my-6 capitalize text-neutral-800">
                  {event.title}
                </h1>
                {event.subtitle && (
                  <h4 className="text-2xl font-semibold mb-4">
                    {event.subtitle}
                  </h4>
                )}
                <p className="flex items-center w-fit min-w-sm bg-stone-100 rounded-md p-6 gap-x-3 my-7">
                  <IoPerson className="text-blue-600/80 w-8 scale-[180%]" />
                  <span className="text-xl">
                    <span className="text-gray-500">By</span>{" "}
                    {event.hoster.name}{" "}
                    <span className="text-gray-500">contact @</span>{" "}
                    <span className="underline">{event.hoster.email}</span>
                  </span>
                </p>
                <div className="mt-4 mb-6">
                  <h4 className="text-2xl font-semibold mb-4">Date and time</h4>
                  <p className="flex items-center ml-2">
                    <LuCalendarCheck2 className="text-blue-600/80 mr-2 w-4 scale-125" />
                    <span className="ml-2">
                      {formatDate(event.date, event.time)}
                    </span>
                  </p>
                </div>

                <div className="mt-4 mb-6">
                  <h4 className="text-2xl font-semibold mb-4">Location</h4>
                  <Link
                    to={`/venues/${event.venue.id}`}
                    className="flex items-start ml-2"
                  >
                    <FaLocationDot className="text-blue-600/80 mr-2 w-4 h-4 scale-110 mt-1" />
                    <p>
                      <span className="ml-2 border-b">{event.venue.name}</span>
                      <span className="block mt-1">{event.venue.location}</span>
                    </p>
                  </Link>
                </div>

                <div className="mt-4 mb-6">
                  <h4 className="text-2xl font-semibold mb-4">Event Type</h4>
                  <p className="flex items-center ml-2 tracking-wider">
                    <MdCategory className="text-blue-600/80 mr-2 w-4 h-4 scale-125 mt-1" />
                    <span className="ml-2">{event.type}</span>
                  </p>
                </div>

                <div className="mt-4 mb-6">
                  <h4 className="text-2xl font-semibold mb-4">
                    About this event
                  </h4>
                  <p className="flex items-center ml-2 tracking-wider">
                    <span className="ml-2 whitespace-pre-line leading-relaxed">
                      {event.description}
                    </span>
                  </p>
                </div>
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-4 mb-6">
                    <h4 className="text-2xl font-semibold mb-4">Tags</h4>
                    <p className="flex items-center ml-2 tracking-wider">
                      {event.tags.map((item, i) => (
                        <span
                          key={i}
                          className="bg-black/80 text-white py-1.5 px-3 mx-1 rounded-lg"
                        >
                          {item}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {event.faqs && event.faqs.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-2xl font-semibold mb-4">
                      Frequently Asked Questions
                    </h4>
                    <div className="space-y-3">
                      {event.faqs &&
                        event.faqs.map((faq, index) => (
                          <details
                            key={index}
                            className="bg-white border border-gray-300 rounded-md p-4 shadow-sm"
                          >
                            <summary className="font-medium cursor-pointer">
                              {faq.question}
                            </summary>
                            <p className="text-gray-600 mt-2">{faq.answer}</p>
                          </details>
                        ))}
                    </div>
                  </div>
                )}
                {event.accessType !== "open" && (
                  <div className="mt-4">
                    <QRScanner eventId={event.id} />
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/4 relative pt-8">
              {user &&
                (user.userId === event.hoster.id || user.role === "admin") && (
                  <Link
                    to={`edit`}
                    className="absolute top-0 right-0 border border-blue-600/80 rounded-lg px-2 py-1 cursor-pointer text-xl hover:bg-blue-600/80 hover:text-white duration-200 flex items-center group"
                    type="button"
                  >
                    <FaEdit className="text-blue-600/80 mr-2 w-4 h-4 scale-125 group-hover:text-white duration-200" />
                    Edit
                  </Link>
                )}
              <div className="sticky top-20 mt-4 border border-gray-200 rounded-lg p-6 bg-stone-50 shadow-lg">
                {event.accessType === "open" && (
                  <div className="text-center space-y-4">
                    <p className="text-xl font-medium text-blue-700 pb-2 border-b-2 border-blue-200 w-fit mx-auto">
                      No tickets needed!
                    </p>
                    <p className="text-gray-600">Open attendance</p>
                  </div>
                )}

                {event.accessType === "free-limited" && (
                  <div className="space-y-6">
                    <p className="text-xl font-medium text-blue-700 pb-2 border-b-2 border-blue-200 w-fit mx-auto">
                      Free, book your ticket
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center text-gray-700">
                        <span>Avaialble Seats:</span>
                        <span className="flex items-center ml-2 font-medium text-blue-600">
                          {event.seats}
                          <PiChairFill className="ml-1.5 text-gray-600" />
                        </span>
                      </div>
                      {user?.role === "attendee" && (
                        <Button onClick={handleReserveClick}>
                          Reserve Your Seat
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {event.accessType === "paid" && (
                  <div className="space-y-6">
                    <p className="text-xl font-medium text-blue-700 pb-2 border-b-2 border-blue-200 w-fit mx-auto">
                      Ticket Required
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center text-gray-700">
                        <span>Avaialble Seats:</span>
                        <span className="flex items-center ml-2 font-medium text-blue-600">
                          {event.seats}
                          <PiChairFill className="ml-1.5 text-gray-600" />
                        </span>
                      </div>
                      <div className="text-center text-gray-700">
                        <span>Price:</span>
                        <span className="ml-2 font-medium text-blue-600">
                          ${event.price}
                        </span>
                      </div>
                      {user?.role === "attendee" && (
                        <Button onClick={handleBookClick}>Buy Ticket</Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Confirmation Modal */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Confirm Reservation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to{" "}
                    {event.accessType === "paid" ? "purchase" : "reserve"} this
                    ticket?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
                    >
                      Yes, Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading event details...</p>
        )}
      </div>
    </>
  );
}

export const loader = async ({ params }) => {
  const res = await fetch(`http://localhost:3000/events/${params.eventId}`);

  if (!res.ok) {
    throw { message: "Could not fetch event details" };
  } else {
    const data = await res.json();
    return data;
  }
};
