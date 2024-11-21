import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  getMessages,
  receiveMessage,
} from "../features/messages/messageSlice";
import Toast from "./Toast";

export default function OnlineChat({ socket }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const messagesContainerRef = useRef(null);
  const messages = useSelector((state) => state.message.list);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scroll({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  useEffect(() => {
    socket.emit("user:login", { userId: user._id, username: user.username });
    socket.on("user:list", (onlineUsers) => {
      const updatedUsers = [
        ...new Map(onlineUsers.map((user) => [user.userId, user])).values(),
      ];
      setUsers(updatedUsers.filter((a) => a.userId !== user._id));
    });

    return () => {
      socket.off("user:list");
    };
  }, [socket, user._id, user.username, user]);

  useEffect(() => {
    socket.on("message:receive", (message) => {
      if (message.sender._id === activeUser.userId)
        dispatch(receiveMessage(message));
    });
    return () => {
      socket.off("message:receive");
    };
  });

  const handleSelectUser = (user) => {
    setActiveUser(user);
    dispatch(getMessages(user.userId));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setActiveUser(null);
  };

  const handleAddMessage = (e) => {
    e.preventDefault();

    try {
      socket.emit("message:send", {
        toUserId: activeUser.userId,
        content: newMessage,
      });
      dispatch(
        addMessage({ content: newMessage, receiver: activeUser.userId })
      ).unwrap();
      setNewMessage("");
    } catch (error) {
      Toast.error(
        "There was an error sending the message" + error?.details?.message
      );
    }
  };

  return (
    <div className="pt-20 pl-1 bg-slate-800 min-h-screen text-white">
      <div className="text-center text-2xl underline">This is a Chat Page</div>
      <div className="flex min-h-screen mt-4 pb-10">
        <div className="w-1/3 py-4 px-1 bg-slate-700 rounded overflow-y-auto">
          <div className="text-center mt-3 underline">Onilne Users:</div>
          {users.length > 0 &&
            users.map((user) => (
              <div
                onClick={() => handleSelectUser(user)}
                className="bg-slate-800 text-wrap p-1 rounded my-2"
                key={user.userId}
              >
                {user.username}{" "}
                <div className="text-sm text-gray-400 "> {user.userId}</div>
              </div>
            ))}
          {users.length < 1 && (
            <div className="text-2xl text-center items-center mt-32 text-slate-400">
              No user online!
            </div>
          )}
        </div>
        <div className="w-2/3 mx-1 p-4 bg-slate-700 rounded">
          {activeUser ? (
            <div>
              <div className="flex bg-gray-600 p-3 rounded">
                <div className="w-8">
                  <div onClick={handleCancel} className="text-center">
                    X
                  </div>
                </div>
                <div className="ml-10 font-semibold">{activeUser.username}</div>
              </div>
              <div className="Messages">
                <div
                  ref={messagesContainerRef}
                  className="rounded-lg mb-2 mt-6  overflow-y-auto max-h-[340px]"
                >
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="mb-2 p-2 rounded-md bg-gray-900 whitespace-normal break-words"
                      >
                        <strong className="text-lg">
                          {msg?.sender?.username
                            ? msg.sender?.username
                            : user.username}
                          :
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
                    <div className="p-3 bg-red-800 text-center">
                      No messages found
                    </div>
                  )}
                </div>
                <form onSubmit={handleAddMessage} className="w-3/4 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 bg-gray-800 rounded text-white"
                    placeholder="Type a message"
                  />
                  <button
                    onClick={handleAddMessage}
                    className="m-2 bg-blue-800 p-2 rounded"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-2xl text-center items-center mt-32 text-slate-400">
              Select a user to continue chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
