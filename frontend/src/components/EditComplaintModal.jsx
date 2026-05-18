import { useState } from "react";
import api from "../services/api";

function EditComplaintModal({
  complaint,
  fetchComplaints,
  closeModal,
}) {

  const [formData, setFormData] = useState({

    complaintDate:
      complaint.complaintDate
        ?.split("T")[0] || "",

    department:
      complaint.department || "",

    description:
      complaint.description || "",

    priority:
      complaint.priority || "Normal",

    reportTime:
      complaint.reportTime || "",

  });


  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================
  // UPDATE COMPLAINT
  // =====================================

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await api.put(
        `/api/complaints/${complaint.id}`,
        {
          ...formData,
          status: complaint.status,
          respondTime: complaint.respondTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Complaint updated");

      fetchComplaints();

      closeModal();

    } catch (error) {

      console.log(error);

      alert("Error updating complaint");

    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-blue-600">
            Edit Complaint
          </h2>

          <button
            onClick={closeModal}
            className="text-red-500 font-bold text-2xl"
          >
            ✕
          </button>

        </div>


        {/* FORM */}
        <form
          onSubmit={handleUpdate}
          className="space-y-5"
        >

          {/* DATE */}
          <div>

            <label className="font-semibold block mb-2">
              Complaint Date
            </label>

            <input
              type="date"
              name="complaintDate"
              value={formData.complaintDate}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

          </div>


          {/* REPORT TIME */}
          <div>

            <label className="font-semibold block mb-2">
              Report Time
            </label>

            <input
              type="time"
              name="reportTime"
              value={formData.reportTime}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

          </div>


          {/* DEPARTMENT */}
          <div>

            <label className="font-semibold block mb-2">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >

              <option>OPD</option>
              <option>IPD</option>
              <option>ICU</option>
              <option>OT</option>
              <option>Billing</option>
              <option>Pharmacy</option>
              <option>Laboratory</option>
              <option>Radiology</option>
              <option>Reception</option>
              <option>Ward</option>
              <option>Other</option>

            </select>

          </div>


          {/* PRIORITY */}
          <div>

            <label className="font-semibold block mb-2">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >

              <option>Normal</option>
              <option>Urgent</option>
              <option>Critical</option>

            </select>

          </div>


          {/* DESCRIPTION */}
          <div>

            <label className="font-semibold block mb-2">
              Complaint Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              rows="5"
              required
            />

          </div>


          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Update Complaint
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditComplaintModal;