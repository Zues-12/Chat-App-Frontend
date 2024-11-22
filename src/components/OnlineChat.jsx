import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addMessage,
  getMessages,
  receiveMessage,
} from "../features/messages/messageSlice";
import Toast from "./Toast";

export default function OnlineChat({ socket }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const messages = useSelector((state) => state.message.list);
  const messagesContainerRef = useRef(null); // Reference for messages container for auto-scrolling
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  /** Will scroll to bottom of the messages when a new message is added */
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scroll({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };
    scrollToBottom();
  }, [messages.length]);

  /** Fetches the list of online users and filters out the logged-in user*/
  useEffect(() => {
    const updateUserList = (onlineUsers) => {
      const uniqueUsers = [
        ...new Map(onlineUsers.map((user) => [user.userId, user])).values(),
      ];
      setUsers(uniqueUsers.filter((u) => u.userId !== user._id));
    };

    socket.emit("user:login", { userId: user._id, username: user.username });
    socket.on("user:list", updateUserList);

    return () => {
      socket.off("user:list", updateUserList);
    };
  }, [socket, user]);

  /**Listens for incoming messages and adds them in state */
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message.sender?._id === activeUser?.userId) {
        dispatch(receiveMessage(message));
      } else {
        Toast.info(`${message.sender?.username} Sent you a message`);
      }
    };
    socket.on("message:receive", handleReceiveMessage);

    return () => {
      socket.off("message:receive", handleReceiveMessage);
    };
  }, [socket, activeUser, dispatch]);

  const handleSelectUser = useCallback(
    (user) => {
      setActiveUser(user);
      dispatch(getMessages(user.userId));
    },
    [dispatch]
  );

  /** Sends a new message */
  const handleAddMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) {
        Toast.error("Message cannot be empty.");
        return;
      }
      try {
        socket.emit("message:send", {
          toUserId: activeUser?.userId,
          content: newMessage,
        });
        await dispatch(
          addMessage({ content: newMessage, receiver: activeUser?.userId })
        ).unwrap();
        setNewMessage("");
      } catch (error) {
        Toast.error("Error sending the message: " + error?.details?.message);
      }
    },
    [socket, activeUser, newMessage, dispatch]
  );

  /** Memoizes online users */
  const memoizedUsers = useMemo(
    () =>
      [...new Map(users.map((user) => [user.userId, user])).values()].filter(
        (u) => u.userId !== user._id
      ),
    [users, user._id]
  );

  /** Formats the messages timestamps */
  const formattedMessages = useMemo(
    () =>
      messages.map((msg) => ({
        ...msg,
        formattedTime: new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }).format(new Date(msg.createdAt)),
      })),
    [messages]
  );

  return (
    <div className="pt-20 pl-1 bg-slate-800 min-h-screen text-white">
      <div className="text-center text-2xl underline">This is a Chat Page</div>
      <div className="flex min-h-screen mt-4 pb-10">
        <div className="w-1/3 py-4 px-1 justify-items-center bg-slate-700 rounded overflow-y-auto">
          <div className="text-center mt-3  underline">Onilne Users:</div>
          {memoizedUsers?.length > 0 &&
            memoizedUsers.map((u) => (
              <div
                onClick={() => handleSelectUser(u)}
                className={` p-1 rounded my-2 cursor-pointer max-w-72 justify-items-center ${
                  activeUser?.userId === u.userId
                    ? "bg-blue-800"
                    : "bg-slate-800"
                }`}
                key={u.userId}
              >
                {u.username}{" "}
                <div className="text-sm text-wrap text-gray-400">
                  {u.userId}
                </div>
              </div>
            ))}
          {users?.length < 1 && (
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
                  <div
                    onClick={() => setActiveUser(null)}
                    className="text-center"
                  >
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
                  {formattedMessages?.length > 0 ? (
                    formattedMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className="mb-2 p-2 rounded-md bg-gray-900 whitespace-normal break-words"
                      >
                        <strong className="text-lg">
                          {msg.sender?.username || user.username}:
                        </strong>{" "}
                        {msg.content}
                        <p className="text-gray-400 text-xs text-right">
                          {msg.formattedTime}
                        </p>
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
                    required
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 bg-gray-800 rounded text-white"
                    placeholder="Type a message"
                  />
                  <button className="m-2 bg-blue-800 p-2 rounded">Send</button>
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
