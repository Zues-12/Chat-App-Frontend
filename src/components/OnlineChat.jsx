import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export default function OnlineChat({ socket }) {
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const messagesContainerRef = useRef(null);
  //   const messages = useSelector((state) => state.message.list);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
  }, [users, socket, user._id, user.username]);

  useEffect(() => {
    socket.on(
      "message:receive",
      (message) => {
        messages.push(message);
      },
      [messages]
    );

    return () => {
      socket.off("message:receive");
    };
  });

  const handleSelectUser = (user) => {
    setActiveUser(user);
    setMessages([]);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setActiveUser(null);
  };

  const handleAddMessage = (e) => {
    e.preventDefault();
    socket.emit("message:send", {
      toUserId: activeUser.userId,
      content: newMessage,
    });
    setNewMessage("");

    const message = {
      senderId: user._Id,
      sender: user.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    messages.push(message);
  };

  return (
    <div className="pt-20 pl-5 bg-slate-800 flex flex-col h-screen text-white">
      <div className="text-center text-2xl underline">This is a Chat Page</div>
      <div className="flex h-screen mt-5 pb-10">
        <div className="w-1/3 p-4 bg-slate-700 rounded overflow-y-auto max-h-[470px]">
          <div className="text-center m-3 underline">Onilne Users:</div>
          {users.length > 0 &&
            users.map((user) => (
              <div
                onClick={() => handleSelectUser(user)}
                className="bg-slate-800 p-2 rounded my-2"
                key={user.userId}
              >
                {user.username}{" "}
                <span className="text-sm text-gray-400"> {user.userId}</span>
              </div>
            ))}
          {users.length < 1 && (
            <div className="text-2xl text-center items-center mt-32 text-slate-400">
              No user online!
            </div>
          )}
        </div>
        <div className="w-2/3 mx-2 p-4 bg-slate-700 rounded">
          <div className="text-center m-3 underline">ChatBox</div>
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
                  className="rounded-lg mb-2 mt-6  overflow-y-auto max-h-[260px]"
                >
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.senderId}
                        className="mb-2 p-2 rounded-md bg-gray-900 whitespace-normal break-words"
                      >
                        <strong className="text-lg">
                          {msg?.sender ? msg.sender : ""}:
                        </strong>{" "}
                        {msg.content}
                        <p className="text-gray-400 text-xs text-right">
                          {" "}
                          {Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                          }).format(new Date(msg.timestamp))}
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
