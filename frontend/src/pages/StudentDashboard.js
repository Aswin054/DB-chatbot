import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiX, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi" }
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    setMessages((prev) => [...prev, { sender: "bot", text: "Typing...", typing: true }]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => !msg.typing));
        setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to chatbot." }]);
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <header className="chat-header">
        <h2>GenZAI</h2>
        <div className="chat-actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={() => window.history.back()}>
            <FiX />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`chat-bubble ${msg.sender}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}><FiSend /></button>
      </div>
    </div>
  );
};

export default StudentDashboard;