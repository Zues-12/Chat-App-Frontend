// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";
import Toast from "./Toast";
import { toFormData } from "axios";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { status } = useSelector((state) => state?.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      Toast.success("Successfully logged in");
      navigate("/chat");
    } catch (error) {
      Toast.error(
        "An error occurred while logging in:" + error?.details?.message
      );
    }
  };

  return (
    <div className="flex justify-center items-start pt-20 min-h-screen bg-[#323639] login-page">
      <form
        className="bg-gray-900 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
        disabled={status === "loading"}
      >
        <div>
          <h2 className="text-2xl text-white font-bold mb-4">Login</h2>
        </div>
        <input
          className="border p-2 w-full mb-4"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          name="password"
          value={toFormData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={status === "loading"}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
