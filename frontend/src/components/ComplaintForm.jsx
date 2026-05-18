import { useState } from "react";
import api from "../services/api";

function ComplaintForm({ fetchComplaints, closeForm }) {

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    department: "",
    priority: "Normal",
    description: "",
    complaintDate: new Date().toISOString().split("T")[0],
    reportTime: "",
    respondTime: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await api.post(
        "/api/complaints",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Complaint Saved Successfully");

      fetchComplaints();

      closeForm();

    } catch (error) {

      console.log(error);

      alert("Error saving complaint");

    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-blue-600">
            Add Complaint
          </h2>

          <button
            onClick={closeForm}
            className="text-red-500 font-bold text-2xl"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* USER */}
          <div>

            <label className="font-semibold block mb-2">
              Logged In User
            </label>

            <input
              type="text"
              value={user?.fullName}
              disabled
              className="w-full border p-3 rounded-lg bg-gray-100"
            />

          </div>

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

          {/* RESPOND TIME */}
          <div>

            <label className="font-semibold block mb-2">
              Respond Time
            </label>

            <input
              type="time"
              name="respondTime"
              value={formData.respondTime}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
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

              <option value="">
                Select Department
              </option>

              <option>Admin Block</option>
              <option>CSSD</option>
              <option>Store</option>
              <option>Library</option>
              <option>Accounts</option>
              <option>HR</option>
              <option>Blood Bank</option>
              <option>Marketing</option>
              <option>ICU</option>
              <option>HDU</option>
              <option>Dialysis</option>
              <option>OT MSB</option>
              <option>Housekeeping</option>
              <option>MSB - NS 2nd Floor</option>
              <option>Cathlab</option>
              <option>Laboratory</option>
              <option>Vertigo Lab</option>
              <option>OPD Reception</option>
              <option>Central Reception</option>
              <option>Doctor Room</option>
              <option>Radiology</option>
              <option>Pharmacy</option>
              <option>ECG</option>
              <option>Canteen</option>
              <option>Physiotherapy</option>
              <option>TPA</option>
              <option>Cash Counter</option>
              <option>Security</option>
              <option>Emergency</option>
              <option>MCB - OT</option>
              <option>MCB - Observation/Recovery</option>
              <option>MCB - NICU/PICU</option>
              <option>MCB - MRD</option>
              <option>MCB - PRO</option>
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
              placeholder="Enter complaint details..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              rows="5"
              required
            />

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-2">

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Save Complaint
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ComplaintForm;