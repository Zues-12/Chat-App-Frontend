// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Toast from "./Toast";
import { signup } from "../features/auth/authSlice";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(form)).unwrap();
      Toast.success("Successfully Signed up");
      navigate("/login");
    } catch (error) {
      Toast.error("An error occurred" + error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-16 bg-[#323639]">
      <form
        className="bg-gray-900 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
        disabled={status === "loading"}
      >
        <h2 className="text-2xl text-white font-bold mb-4">Signup</h2>

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded-md p-2 w-full mb-4"
        />
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="border rounded-md p-2 w-full mb-4"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border rounded-md p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
