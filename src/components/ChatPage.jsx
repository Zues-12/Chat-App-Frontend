import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import { getRooms } from "../features/rooms/roomsSlice";
import {
  addMessage,
  getMessages,
  receiveMessage,
} from "../features/messages/messageSlice";

export default function ChatPage({ socket }) {
  const user = useSelector((state) => state.auth.user);
  const rooms = useSelector((state) => state.room.list);
  const errorRoom = useSelector((state) => state.room.erro);
  const errorMessage = useSelector((state) => state.message.error);
  const messages = useSelector((state) => state.message.list);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [activeRoom, setActiceRoom] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    try {
      dispatch(getRooms()).unwrap();
    } catch (error) {
      Toast.error("An error occured" + error?.details?.message);
    }
  }, [dispatch]);

  useEffect(() => {
    socket.on("messageReceived", (message) => {
      dispatch(receiveMessage(message));
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [dispatch, messages, socket]);

  const handleGetMessages = async (roomId) => {
    if (activeRoom) {
      socket.emit("leaveRoom", activeRoom);
    }
    try {
      setActiceRoom(roomId);
      dispatch(getMessages(roomId));
      socket.emit("joinRoom", roomId);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      Toast.error("An error occured" + error?.details?.message);
    }
  };

  const handleAddMessage = async (e) => {
    try {
      e.preventDefault();
      if (!newMessage.trim() || !activeRoom) return;

      const message = {
        roomId: activeRoom,
        sender: { username: user.username, id: user._id },
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      dispatch(
        addMessage({ roomId: activeRoom, content: newMessage })
      ).unwrap();
      setNewMessage("");
      socket.emit("sendMessage", message);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      Toast.error("An error occured" + error?.details?.message);
    }
  };

  if (errorRoom)
    return <div className="pt-20 ">An error occured: {errorRoom}</div>;

  return (
    <>
      <div className="text-center pt-16 bg-slate-900 p-2 text-white">
        Chat Page
      </div>
      <div className="flex min-h-screen ">
        <div className="bg-slate-600 items-center text-white w-1/3">
          <Link to="/addRoom">
            <button className="bg-slate-400 p-2 rounded m-2 ml-6">
              Add room
            </button>
          </Link>
          <div className="text-white ml-5 mt-1 p-2 w-3/4">Rooms:</div>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room._id}
                onClick={() => handleGetMessages(room._id)}
                className={
                  room._id === activeRoom
                    ? "ml-5 my-2 bg-blue-900 p-3 w-3/4 rounded-md"
                    : "ml-5 my-2 bg-slate-800 p-3 w-3/4 rounded-md"
                }
              >
                {room.name}
                {"  "}
                {/* <div className="text-gray-400 text-sm">Id: {room._id}</div> */}
                <div className="text-gray-400 text-sm">Members:</div>
                {room.members?.length > 0 &&
                  room.members.map((member) => (
                    <div className="text-gray-400 text-sm">
                      {member.username}
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <div className="ml-5 my-3  p-3 w-3/4">No rooms found</div>
          )}
        </div>
        <div className="bg-slate-800 items-center pl-5 text-white w-2/3">
          {activeRoom ? (
            <div>
              {" "}
              {errorMessage ? (
                <div className="pt-20">
                  An error occured: {errorMessage}
                  <form onSubmit={handleAddMessage} className="w-3/4 flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow p-2 bg-gray-700 rounded text-white"
                      placeholder="Type a message"
                    />
                    <button className="ml-2 bg-blue-500 p-2 rounded">
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div
                    ref={messagesContainerRef}
                    className="  bg-gray-800 rounded-lg mb-2 mt-6  overflow-y-auto max-h-[420px]"
                  >
                    {messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className="mb-2 p-2 rounded-md bg-gray-900 whitespace-normal break-words"
                        >
                          <strong className="text-lg">
                            {msg?.sender?.username ? msg.sender?.username : ""}:
                          </strong>{" "}
                          {msg.content}
                          <p className="text-gray-400 text-xs text-right">
                            {" "}
                            {Intl.DateTimeFormat("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              hour12: true,
                            }).format(new Date(msg.createdAt))}
                          </p>{" "}
                        </div>
                      ))
                    ) : (
                      <div>No messages found</div>
                    )}
                    <div className="" ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleAddMessage} className="w-3/4 flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow p-2 bg-gray-700 rounded text-white"
                      placeholder="Type a message"
                    />
                    <button className="ml-2 bg-blue-500 p-2 rounded">
                      Send
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : (
            <div>No Room Selected</div>
          )}

          {/* {errorMessage ? (
            <div className="pt-20">
              An error occured: {errorMessage}
              <form onSubmit={handleAddMessage} className="w-3/4 flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 bg-gray-700 rounded text-white"
                  placeholder="Type a message"
                />
                <button className="ml-2 bg-blue-500 p-2 rounded">Send</button>
              </form>
            </div>
          ) : (
            <>
              <div
                ref={messagesContainerRef}
                className="  bg-gray-800 rounded-lg mb-2 mt-6  overflow-y-auto max-h-[420px]"
              >
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className="mb-2 p-2 rounded-md bg-gray-900 whitespace-normal break-words"
                    >
                      <strong className="text-lg">
                        {msg?.sender?.username ? msg.sender?.username : ""}:
                      </strong>{" "}
                      {msg.content}
                      <p className="text-gray-400 text-xs text-right">
                        {" "}
                        {Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        }).format(new Date(msg.createdAt))}
                      </p>{" "}
                    </div>
                  ))
                ) : (
                  <div>No messages found</div>
                )}
                <div className="" ref={messagesEndRef} />
              </div>
              <form onSubmit={handleAddMessage} className="w-3/4 flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 bg-gray-700 rounded text-white"
                  placeholder="Type a message"
                />
                <button className="ml-2 bg-blue-500 p-2 rounded">Send</button>
              </form>
            </>
          )} */}
        </div>
      </div>
    </>
  );
}
