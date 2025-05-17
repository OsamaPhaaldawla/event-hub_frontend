import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Using react-icons for arrows

export default function ImageGall({ images, classes, blur_back }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedIndex(0);
    }
  }, [images]);

  const handlePrevious = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full relative group duration-300 rounded-2xl overflow-hidden">
        {blur_back && (
          <img
            src={images[selectedIndex].url}
            alt="Background"
            className={`absolute inset-0 w-full object-cover blur-lg scale-110 ${
              classes ? classes : "h-full"
            }`}
          />
        )}
        <div
          className={`w-4/5 relative z-10 flex items-center justify-center mx-auto ${
            classes ? classes : "h-[550px] mt-6"
          }`}
        >
          <img
            src={images[selectedIndex].url}
            alt="Foreground"
            className={`w-full rounded-lg mx-auto shadow-lg ${
              classes ? classes : "h-full"
            }`}
          />

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Previous image"
            type="button"
          >
            <FaChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Next image"
            type="button"
          >
            <FaChevronRight size={24} />
          </button>
        </div>
        {blur_back && <div className="absolute inset-0 bg-black/20 z-0" />}
      </div>
      <div className="flex justify-center gap-2 mt-4 relative">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
