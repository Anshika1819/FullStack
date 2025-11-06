import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

const SOCKET_SERVER_URL = "http://localhost:5000"; // change if your server is elsewhere

function App() {
  const [socket, setSocket] = useState(null);
  const [enteredName, setEnteredName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);

    s.on("connect", () => {
      console.log("Connected to socket server:", s.id);
    });

    s.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("users", (list) => {
      setUsers(list);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    const name = enteredName.trim() || "Anonymous";
    setUsername(name);
    socket?.emit("join", name);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    socket?.emit("message", text);
    setMessage("");
  };

  return (
    <div className="container">
      <div className="canvas">
        <h1>My Chat App</h1>

        <div className="section join">
          {!username ? (
            <form onSubmit={handleJoin} className="join-form">
              <label>Username:</label>
              <input
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
                placeholder="Enter your name..."
              />
              <button type="submit">Join</button>
            </form>
          ) : (
            <div className="joined">You are: <strong>{username}</strong></div>
          )}
        </div>

        <div className="section chat">
          <h2>Chat Room</h2>
          <div className="main">
            <div className="messages-box">
              <div className="messages">
                {messages.map((m, idx) => (
                  <div key={idx} className={`message ${m.user === username ? "mine" : ""}`}>
                    <div className="meta">
                      <span className="user">{m.user}</span>
                      <span className="time">{new Date(m.time).toLocaleTimeString()}</span>
                    </div>
                    <div className="text">{m.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="send-form">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!username}
                />
                <button type="submit" disabled={!username}>Send</button>
              </form>
            </div>

            <aside className="sidebar">
              <h3>Connected Users</h3>
              <ul>
                {users.length ? users.map((u, i) => <li key={i}>{u}</li>) : <li><em>No users</em></li>}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
