import React, { useState } from "react";
import { addRooms } from "../features/rooms/roomsSlice";
import { useDispatch } from "react-redux";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";

export default function AddRoom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newRoom, setNewRoom] = useState({
    name: "",
    members: "",
  });
  const [membersList, setMembersList] = useState([]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      dispatch(addRooms({ name: newRoom.name, members: membersList })).unwrap();
      setNewRoom({
        name: "",
        members: [],
      });
      setMembersList([]);
      Toast.success("Room created successfully");
      navigate("/chat");
    } catch (error) {
      Toast.error("An error occured" + error);
    }
  };

  const handleAddMember = () => {
    if (newRoom.members.trim()) {
      setMembersList((prev) => [...prev, newRoom.members.trim()]);
      setNewRoom({ ...newRoom, members: "" });
    } else {
      Toast.error("Please enter a valid user ID");
    }
  };

  return (
    <div className="bg-slate-600 items-center text-white min-h-screen pt-32">
      <form onSubmit={handleAddRoom} className="py-2 px-2">
        <input
          required
          type="text"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          className="flex-grow p-2 mb-2 mx-2 bg-gray-700 rounded text-white"
          placeholder="Enter room name"
        />
        <div className="flex mb-2">
          <input
            type="text"
            value={newRoom.members}
            onChange={(e) =>
              setNewRoom({ ...newRoom, members: e.target.value })
            }
            className="flex-grow p-2 bg-gray-700 rounded text-white"
            placeholder="Enter user ID"
          />
          <button
            type="button"
            onClick={handleAddMember}
            className="ml-2 bg-green-500 p-2 rounded"
          >
            Add Member
          </button>
        </div>
        {/* Display added members */}
        <div className="mb-2">
          <p className="text-sm text-gray-300">Members:</p>
          {membersList.length > 0 ? (
            <ul className="text-sm text-gray-100">
              {membersList.map((member, index) => (
                <li key={index} className="ml-2">
                  {member}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No members added yet</p>
          )}
        </div>
        <button className="ml-2 bg-blue-500 p-2 rounded">Create Room</button>
      </form>
    </div>
  );
}
