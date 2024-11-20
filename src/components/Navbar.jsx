// src/components/NavBar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
  };

  return (
    <>
      <nav className="bg-blue-900 p-4 shadow-md fixed top-0 left-0 w-full z-10 ">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <div className="text-white text-lg font-bold">ChatApp</div>
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/chat" className="text-white hover:text-gray-300">
                    Online Chat
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-white hover:text-gray-300 bg-red-600 p-3 rounded-md"
                    onClick={handleLogout}
                  >
                    LogOut
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-white bg-blue-800 p-3 rounded-md hover:text-gray-300"
                  >
                    LogIn
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-white bg-blue-800 p-3 rounded-md hover:text-gray-300"
                  >
                    SignUp
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
