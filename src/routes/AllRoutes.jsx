import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "../components/Toast";
import Home from "../components/HomePage";
import Navbar from "../components/Navbar";
import Login from "../components/LoginPage";
import Signup from "../components/SignupPage";
import ProtectedRoute from "../components/ProtectedRoute";
import OnlineChat from "../components/OnlineChat";
import io from "socket.io-client";

// Connects to the socket at the backend
const socket = io("http://localhost:5000/", {
  transports: ["websocket"],
  withCredentials: true,
});

export default function AllRoutes() {
  return (
    <>
      <Router>
        <Navbar socket={socket} />
        <ToastProvider />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route
              exact
              path="/chat"
              element={<OnlineChat socket={socket} />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
