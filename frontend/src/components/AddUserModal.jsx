import { useState } from "react";
import api from "../services/api";

function AddUserModal({
  closeModal,
}) {

  const [formData, setFormData] = useState({

    fullName: "",

    username: "",

    password: "",

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
  // CREATE USER
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/api/auth/create-user",
        formData
      );

      alert("User created successfully");

      closeModal();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Error creating user"
      );

    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-blue-600">
            Add New User
          </h2>

          <button
            onClick={closeModal}
            className="text-red-500 text-2xl font-bold"
          >
            ✕
          </button>

        </div>


        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Create User
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddUserModal;