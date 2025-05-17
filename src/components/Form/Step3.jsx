// import { useState } from "react";
// import { validateStep3 } from "./Validatioin";
import { ClipboardList, ImageDown, MapPin } from "lucide-react";
import ImageGall from "../ImageGall";

export default function Step3({
  prev,
  handleSubmit,
  formRef,
  formDataState,
  oldData,
  edit,
  handleBookClick,
}) {
  const data = new FormData(formRef.current);
  const formData = Object.fromEntries(data.entries());
  let images = [];
  if (edit && !formDataState.images) {
    images = oldData.images;
  }

  return (
    <div className="space-y-6 mb-12 max-h-[700px] overflow-y-scroll">
      {/* 1. Event Details */}
      <div className="border p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <ClipboardList size={26} className="text-gray-600 mr-1" />
          Event Details
        </h2>
        <p>
          <strong>Title:</strong> {formData.title}
        </p>
        {formData.subtitle && (
          <p>
            <strong>Subtitle:</strong> {formData.subtitle}
          </p>
        )}
        <p>
          <strong>Type:</strong> {formData.type}
        </p>
        <p>
          <strong>Access Type:</strong> {formData.accessType}
        </p>

        {(formData.accessType === "free-limited" ||
          formData.accessType === "paid") && (
          <p>
            <strong>Available Seats:</strong> {formData.seats}
          </p>
        )}

        {formData.accessType === "paid" && (
          <p>
            <strong>Price:</strong> ${formData.price}
          </p>
        )}

        <p className="mt-2 max-w-full flex flex-wrap">
          <strong>Description:</strong> {formData.description}
        </p>

        {formDataState.tags && (
          <p className="my-2">
            <strong>Tags: </strong>
            {formDataState.tags.map((item) => (
              <span className="mx-1 px-2 py-1 bg-black/70 text-white rounded-lg">
                {item}
              </span>
            ))}
          </p>
        )}
        {formDataState.faqs && (
          <div>
            <strong>FAQs: </strong>
            {formDataState.faqs.map((item) => (
              <div className="bg-white/35 p-2 mb-3 rounded-lg border-2 border-gray-200">
                <p>
                  <span className="text-gray-700">question:</span>{" "}
                  {item.question}
                </p>
                <p>
                  <span className="text-gray-700">answer:</span> {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Images Preview */}
      {formData.images && (
        <div className="border p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <ImageDown size={26} className="text-gray-600 mr-1" />
            Event Image
          </h2>
          <div className="lg:w-4/5 mx-auto">
            {(formDataState.images || edit) && (
              <ImageGall
                images={formDataState.images ? formDataState.images : images}
              />
            )}
          </div>
        </div>
      )}

      {/* 3. Venue Selection */}
      <div className="border p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <MapPin size={24} className="text-gray-600 mr-1" />
          Venue Selection
        </h2>
        <p>
          <strong>Venue:</strong> {formDataState.venueName}
        </p>
        <p>
          <strong> Date:</strong> {formData.date}
        </p>
        <p>
          <strong>Time:</strong> {formData.time}
        </p>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex justify-between mt-6 mb-3">
        <button
          type="button"
          onClick={prev}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer"
        >
          ← Edit
        </button>

        <button
          type="button"
          onClick={edit ? handleSubmit : handleBookClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          {edit ? "✅ Save the Changes" : "✅ Go to Checkout"}
        </button>
      </div>
    </div>
  );
}
