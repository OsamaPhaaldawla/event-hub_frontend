import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";

export default function EditSlots() {
  const { venueId } = useParams();
  const [slots, setSlots] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSlots() {
      const res = await fetch(`http://localhost:3000/venues/${venueId}/slots`);
      const data = await res.json();
      setSlots(data || []);
    }
    fetchSlots();
  }, [venueId]);

  const addDate = () => {
    if (!newDate || slots.some((s) => s.date === newDate)) return;
    setSlots([...slots, { date: newDate, times: [] }]);
    setNewDate("");
  };

  const removeDate = (dateToRemove) => {
    setSlots(slots.filter((s) => s.date !== dateToRemove));
  };

  const addTimeToDate = () => {
    if (selectedDateIndex === null || !newTime) return;
    const updated = [...slots];
    const day = updated[selectedDateIndex];
    if (!day.times.includes(newTime)) {
      day.times.push(newTime);
      day.times.sort();
    }
    setSlots(updated);
    setNewTime("");
  };

  const removeTime = (date, timeToRemove) => {
    setSlots(
      slots.map((s) =>
        s.date === date
          ? { ...s, times: s.times.filter((t) => t !== timeToRemove) }
          : s
      )
    );
  };

  const saveSlots = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/venues/${venueId}/slots`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ availableSlots: slots }),
    });

    if (res.ok) {
      toast.success("Slots updated!");
      navigate(`/venues/${venueId}`);
    } else {
      toast.error("Failed to update slots");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Available Slots</h2>

      {/* Add Date */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={addDate}
          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-500"
        >
          Add Date
        </button>
      </div>

      {/* Dates & Times */}
      {slots.map((slot, index) => (
        <div
          key={slot.date}
          className="bg-gray-50 border border-gray-200 rounded p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{slot.date}</h4>
            <button
              className="text-red-600 text-sm cursor-pointer hover:underline"
              onClick={() => removeDate(slot.date)}
            >
              Remove Date
            </button>
          </div>

          {/* Times */}
          <div className="flex flex-wrap gap-2 mb-2">
            {slot.times.map((time) => (
              <div
                key={time}
                className="bg-gray-200 border rounded-lg px-4 py-2 flex items-center gap-3"
              >
                <span>{time}</span>

                <IoCloseSharp
                  onClick={() => removeTime(slot.date, time)}
                  className="text-red-500 cursor-pointer scale-125 hover:scale-150 duration-200"
                />
              </div>
            ))}
          </div>

          {/* Add Time */}
          <div className="flex gap-2">
            <input
              type="time"
              value={selectedDateIndex === index ? newTime : ""}
              onFocus={() => setSelectedDateIndex(index)}
              onChange={(e) => setNewTime(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={addTimeToDate}
              className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-500"
            >
              Add Time
            </button>
          </div>
        </div>
      ))}

      {/* Save */}
      <button
        onClick={saveSlots}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4 cursor-pointer hover:bg-blue-500"
      >
        Save Slots
      </button>
    </div>
  );
}
