import { useState } from "react";
import api from "../services/api";

function ChangePassword({ closeModal }) {

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({

    oldPassword: "",

    newPassword: "",

    confirmPassword: "",

  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {

      alert("Passwords do not match");

      return;
    }

    try {

      await api.put(
        "/api/auth/change-password",
        {
          username: user.username,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }
      );

      alert("Password changed successfully");

      closeModal();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Error changing password"
      );

    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-blue-600">
            Change Password
          </h2>

          <button
            onClick={closeModal}
            className="text-red-500 text-2xl font-bold"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Change Password
          </button>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;