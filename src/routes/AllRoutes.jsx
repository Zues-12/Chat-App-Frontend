import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "../components/Toast";
import Home from "../components/HomePage";
import Navbar from "../components/Navbar";
import Login from "../components/LoginPage";
import Signup from "../components/SignupPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ChatPage from "../components/ChatPage";
import AddRoom from "../components/AddRoom";
import OnlineChat from "../components/OnlineChat";
import io from "socket.io-client";

const socket = io("http://localhost:5000/", {
  transports: ["websocket"],
  withCredentials: true,
});

export default function AllRoutes() {
  return (
    <>
      <Router>
        <Navbar />
        <ToastProvider />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route exact path="/chat" element={<ChatPage socket={socket} />} />
            <Route exact path="/addRoom" element={<AddRoom />} />
            <Route
              exact
              path="/onlineChat"
              element={<OnlineChat socket={socket} />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}