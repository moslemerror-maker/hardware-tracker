import { useState } from "react";
import api from "../services/api";

function CompleteComplaintModal({
  complaintId,
  fetchComplaints,
  closeModal,
}) {

  const [respondTime, setRespondTime] =
    useState("");


  // =====================================
  // AUTO CURRENT TIME
  // =====================================

  const setCurrentTime = () => {

    const now = new Date();

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    setRespondTime(`${hours}:${minutes}`);
  };


  // =====================================
  // COMPLETE COMPLAINT
  // =====================================

  const handleComplete = async () => {

    if (!respondTime) {

      alert("Please enter respond time");

      return;
    }

    try {

      const token = localStorage.getItem("token");

      await api.put(
        `/api/complaints/${complaintId}/status`,
        {
          status: "Completed",
          respondTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComplaints();

      closeModal();

    } catch (error) {

      console.log(error);

      alert("Error completing complaint");

    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-green-600">
            Complete Complaint
          </h2>

          <button
            onClick={closeModal}
            className="text-red-500 text-2xl font-bold"
          >
            ✕
          </button>

        </div>


        {/* TIME INPUT */}
        <div className="space-y-4">

          <div>

            <label className="block mb-2 font-semibold">
              Respond Time
            </label>

            <input
              type="time"
              value={respondTime}
              onChange={(e) =>
                setRespondTime(e.target.value)
              }
              className="w-full border p-3 rounded-lg"
            />

          </div>


          {/* AUTO TIME BUTTON */}
          <button
            onClick={setCurrentTime}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Use Current Time
          </button>


          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-2">

            <button
              onClick={handleComplete}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Complete
            </button>

            <button
              onClick={closeModal}
              className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CompleteComplaintModal;