import { useState } from "react";
import api from "../services/api";

function Login() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      window.location.href = "/dashboard";

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Login failed"
      );

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

        {/* HOSPITAL TITLE */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-700">
            Marwari Hospitals
          </h1>

          <p className="text-gray-600 mt-3 text-lg font-medium">
            IT Hardware Management System
          </p>

        </div>


        {/* LOGIN FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>


        {/* FOOTER */}
        <div className="text-center mt-8 text-sm text-gray-500">

          Developed by MH IT Team

        </div>

      </div>

    </div>
  );
}

export default Login;