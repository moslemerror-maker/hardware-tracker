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

      const response = await api.post("/api/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

      console.log(response.data);

    } catch (error) {

      alert(error.response.data.message);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Hardware Tracker Login
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;