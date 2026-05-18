import { useEffect, useState } from "react";

import api from "../services/api";

import ComplaintForm from "../components/ComplaintForm";
import ComplaintTable from "../components/ComplaintTable";
import ChangePassword from "../components/ChangePassword";

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [complaints, setComplaints] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);


  // =====================================
  // DASHBOARD STATISTICS
  // =====================================

  const totalComplaints = complaints.length;

  const pendingComplaints =
    complaints.filter(
      (item) => item.status !== "Completed"
    ).length;

  const completedComplaints =
    complaints.filter(
      (item) => item.status === "Completed"
    ).length;

  const criticalComplaints =
    complaints.filter(
      (item) => item.priority === "Critical"
    ).length;


  // =====================================
  // FETCH COMPLAINTS
  // =====================================

  const fetchComplaints = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(response.data);

    } catch (error) {

      console.log(error);

    }
  };


  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {

    fetchComplaints();

  }, []);


  return (
    <div className="min-h-screen bg-gray-100">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">

        <h1 className="text-2xl font-bold">
          Hardware Complaint Tracker
        </h1>

        <div className="flex items-center gap-4">

          <p className="font-semibold">
            Welcome, {user?.fullName}
          </p>


          {/* CHANGE PASSWORD */}
          <button
            onClick={() =>
              setShowPasswordModal(true)
            }
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Change Password
          </button>


          {/* LOGOUT */}
          <button
            onClick={() => {

              localStorage.clear();

              window.location.href = "/";

            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>


      {/* =====================================
          CHANGE PASSWORD MODAL
      ===================================== */}

      {showPasswordModal && (

        <ChangePassword
          closeModal={() =>
            setShowPasswordModal(false)
          }
        />

      )}


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="p-8">


        {/* =====================================
            DASHBOARD CARDS
        ===================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* TOTAL */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 font-semibold">
              Total Complaints
            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              {totalComplaints}
            </p>

          </div>


          {/* PENDING */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 font-semibold">
              Pending
            </h2>

            <p className="text-4xl font-bold text-orange-500 mt-3">
              {pendingComplaints}
            </p>

          </div>


          {/* COMPLETED */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 font-semibold">
              Completed
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {completedComplaints}
            </p>

          </div>


          {/* CRITICAL */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 font-semibold">
              Critical
            </h2>

            <p className="text-4xl font-bold text-red-600 mt-3">
              {criticalComplaints}
            </p>

          </div>

        </div>


        {/* =====================================
            TOP ACTION BAR
        ===================================== */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-gray-700">
            Dashboard
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
          >
            + Add Complaint
          </button>

        </div>


        {/* =====================================
            COMPLAINT FORM MODAL
        ===================================== */}

        {showForm && (

          <ComplaintForm
            fetchComplaints={fetchComplaints}
            closeForm={() => setShowForm(false)}
          />

        )}


        {/* =====================================
            COMPLAINT TABLE
        ===================================== */}

        <ComplaintTable
          complaints={complaints}
          fetchComplaints={fetchComplaints}
        />

      </div>

    </div>
  );
}

export default Dashboard;