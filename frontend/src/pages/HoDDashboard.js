import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaChartBar, FaUsers, FaGraduationCap, FaUserTie, FaDownload, FaSearch, FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./HoDDashboard.css";

const studentPerformanceData = [
  { class: "CSE A", passPercentage: 85 },
  { class: "CSE B", passPercentage: 78 },
  { class: "CSE C", passPercentage: 82 },
];

const topStudents = [
  { name: "Arun Kumar", cgpa: 9.8 },
  { name: "Priya Sharma", cgpa: 9.7 },
  { name: "Vignesh R", cgpa: 9.5 },
];

const HoDDashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);
  const [inputText, setInputText] = useState("");

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;
    setMessages([...messages, { sender: "user", text: inputText }]);
    setInputText("");
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "I'm still learning. Let me get back to you!" }]);
    }, 1000);
  };

  return (
    <div className="hod-dashboard">
      <header className="dashboard-header">
        <h1>Panimalar Engineering College</h1>
        <div className="user-profile">
          <span>Welcome, HOD!</span>
          <img src="profile-pic.png" alt="HOD Profile" className="profile-pic" />
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          <ul>
            <li><FaChartBar /> Department Analytics</li>
            <li><FaUsers /> Student Database</li>
            <li><FaGraduationCap /> Class Performance</li>
            <li><FaUserTie /> Top Students</li>
            <li><FaUserTie /> Manage Faculty</li>
          </ul>
        </nav>

        <main className="dashboard-content">
          <div className="chart-section">
            <h2>Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="passPercentage" stroke="#FFD700" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="heatmap-section">
            <h2>Class-Wise Pass Percentage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="passPercentage" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="top-students">
            <h2>🏆 Top-Performing Students</h2>
            <ul>
              {topStudents.map((student, index) => (
                <li key={index}>{student.name} - CGPA: {student.cgpa}</li>
              ))}
            </ul>
          </div>

          <div className="actions">
            <button className="download-btn"><FaDownload /> Download Reports</button>
            <div className="search-box">
              <input type="text" placeholder="Search Student..." />
              <button><FaSearch /></button>
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot Floating Button */}
      <button className="chatbot-button" onClick={toggleChat}>
        <FaRobot />
      </button>

      {/* Chat Sidebar */}
      <div className={`chat-sidebar ${chatOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h3>AI Chat Assistant</h3>
          <button className="close-btn" onClick={toggleChat}><FaTimes /></button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}><FaPaperPlane /></button>
        </div>
      </div>
    </div>
  );
};

export default HoDDashboard;
