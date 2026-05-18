import { useState } from "react";
import api from "../services/api";

import CompleteComplaintModal from "./CompleteComplaintModal";

function ComplaintTable({
  complaints,
  fetchComplaints,
}) {

  // =====================================
  // SEARCH STATE
  // =====================================

  const [search, setSearch] = useState("");


  // =====================================
  // COMPLETE MODAL STATE
  // =====================================

  const [selectedComplaintId, setSelectedComplaintId] =
    useState(null);


  // =====================================
  // FILTERED DATA
  // =====================================

  const filteredComplaints =
    complaints.filter((item) => {

      return (

        item.department
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.user.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.status
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.priority
          .toLowerCase()
          .includes(search.toLowerCase())

      );
    });


  // =====================================
  // DELETE COMPLAINT
  // =====================================

  const deleteComplaint = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this complaint?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await api.delete(
        `/api/complaints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComplaints();

    } catch (error) {

      console.log(error);

      alert("Error deleting complaint");

    }
  };


  // =====================================
  // EXPORT TO EXCEL
  // =====================================

  const exportExcel = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/api/complaints/export/excel",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "complaints.xlsx"
      );

      document.body.appendChild(link);

      link.click();

    } catch (error) {

      console.log(error);

      alert("Export failed");

    }
  };


  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-8">

      {/* =====================================
          COMPLETE MODAL
      ===================================== */}

      {selectedComplaintId && (

        <CompleteComplaintModal
          complaintId={selectedComplaintId}
          fetchComplaints={fetchComplaints}
          closeModal={() =>
            setSelectedComplaintId(null)
          }
        />

      )}


      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-blue-600">
          Complaint Records
        </h2>


        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded-lg w-full md:w-72"
          />


          {/* EXPORT BUTTON */}
          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
          >
            Export Excel
          </button>

        </div>

      </div>


      {/* =====================================
          TABLE
      ===================================== */}

      <div className="overflow-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-blue-100">

              <th className="border p-3">
                Date
              </th>

              <th className="border p-3">
                Department
              </th>

              <th className="border p-3">
                Description
              </th>

              <th className="border p-3">
                Priority
              </th>

              <th className="border p-3">
                Status
              </th>

              <th className="border p-3">
                User
              </th>

              <th className="border p-3">
                Report Time
              </th>

              <th className="border p-3">
                Respond Time
              </th>

              <th className="border p-3">
                Interval
              </th>

              <th className="border p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.length > 0 ? (

              filteredComplaints.map((item) => (

                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                >

                  {/* DATE */}
                  <td className="border p-3">

                    {new Date(
                      item.complaintDate
                    ).toLocaleDateString()}

                  </td>


                  {/* DEPARTMENT */}
                  <td className="border p-3">

                    {item.department}

                  </td>


                  {/* DESCRIPTION */}
                  <td className="border p-3">

                    {item.description}

                  </td>


                  {/* PRIORITY */}
                  <td className="border p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm
                      ${
                        item.priority === "Critical"
                          ? "bg-red-600"
                          : item.priority === "Urgent"
                          ? "bg-yellow-500"
                          : "bg-blue-600"
                      }`}
                    >
                      {item.priority}
                    </span>

                  </td>


                  {/* STATUS */}
                  <td className="border p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm
                      ${
                        item.status === "Completed"
                          ? "bg-green-600"
                          : "bg-orange-500"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>


                  {/* USER */}
                  <td className="border p-3">

                    {item.user.fullName}

                  </td>


                  {/* REPORT TIME */}
                  <td className="border p-3">

                    {item.reportTime || "-"}

                  </td>


                  {/* RESPOND TIME */}
                  <td className="border p-3">

                    {item.respondTime || "-"}

                  </td>


                  {/* INTERVAL */}
                  <td className="border p-3 font-semibold text-blue-600">

                    {item.intervalMinute || "-"}

                  </td>


                  {/* ACTIONS */}
                  <td className="border p-3">

                    <div className="flex gap-2">

                      {item.status !== "Completed" && (

                        <button
                          onClick={() =>
                            setSelectedComplaintId(item.id)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Complete
                        </button>

                      )}

                      <button
                        onClick={() =>
                          deleteComplaint(item.id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="10"
                  className="border p-6 text-center text-gray-500"
                >
                  No complaints found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ComplaintTable;