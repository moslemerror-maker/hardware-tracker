function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">

        <h1 className="text-2xl font-bold">
          Hardware Complaint Tracker
        </h1>

        <div className="flex items-center gap-4">

          <p className="font-semibold">
            Welcome, {user?.fullName}
          </p>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold text-gray-700">
              Total Complaints
            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-4">
              0
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold text-gray-700">
              Pending
            </h2>

            <p className="text-4xl font-bold text-yellow-500 mt-4">
              0
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold text-gray-700">
              Completed
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-4">
              0
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;