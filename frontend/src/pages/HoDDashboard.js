import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiX, FiPlus } from "react-icons/fi"; // ✅ Import FiPlus icon
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for redirection
import "./HoDDashboard.css";

const HoDDashboard = () => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi" }]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const navigate = useNavigate(); // ✅ For navigation to StudentForm

  // ✅ Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Handle Sending Messages
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // ✅ Show "Typing..." for bot while waiting for response
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Typing...", typing: true },
    ]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      // ✅ Simulate typing delay
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => !msg.typing));
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.response },
        ]);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to chatbot." },
      ]);
    }
  };

  // ✅ Navigate to StudentForm Page
  const goToAddStudent = () => {
    navigate("/add-student"); // ✅ Redirect to StudentForm
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Header */}
      <header className="chat-header">
        <div className="chat-actions-left">
          {/* ✅ Add Button to Navigate to StudentForm */}
          <button onClick={goToAddStudent} className="add-student-btn">
            <FiPlus /> Add Student
          </button>
        </div>
        <h2>GenZAI</h2>
        <div className="chat-actions">
          <button onClick={() => window.history.back()}>
            <FiX />
          </button>
        </div>
      </header>

      {/* ✅ Chat Messages */}
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

      {/* ✅ Chat Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default HoDDashboard;
