import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="bg-gray-800 h-screen  flex 1 justify-center items-center pt-20">
      <div className="bg-gray-700 p-10 rounded-lg shadow-lg ">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Welcome to Our Chat App
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Connect with friends, family, and colleagues. Start chatting now!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/chat"
            className="bg-blue-800 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded"
          >
            User Chat
            <p className="text-sm text-gray-300">
              Engage in one-on-one conversations online users.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
