import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMoon, FiSun, FiSmile } from "react-icons/fi";
import { motion } from "framer-motion";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I assist you today? 😊" }
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

    // Simulating AI response
    const botTyping = { sender: "bot", text: "🤖 Typing...", typing: true };
    setMessages((prev) => [...prev, botTyping]);

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
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Error connecting to chatbot." }]);
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Chatbox Container */}
      <motion.div
        className="chatbox-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        {/* Header */}
        <header className="chatbox-header">
          <div className="logo">
            <FiSmile /> AI Chatbot
          </div>
          <div className="chat-actions">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun /> : <FiMoon />}
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

        {/* Quick Reply Buttons */}
        <div className="quick-replies">
          <button onClick={() => setInput("Tell me about my courses")}>
            📚 My Courses
          </button>
          <button onClick={() => setInput("Check my attendance")}>
            ✅ Attendance
          </button>
          <button onClick={() => setInput("Help me with an assignment")}>
            📝 Assignments
          </button>
        </div>

        {/* Chat Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}><FiSend /></button>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;