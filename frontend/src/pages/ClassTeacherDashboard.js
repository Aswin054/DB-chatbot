import React, { useState } from "react";
import "./ClassTeacherDashboard.css";
import { FiBarChart2, FiUserCheck, FiClipboard, FiAlertCircle, FiMessageSquare, FiX } from "react-icons/fi";

const ClassTeacherDashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="class-teacher-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>🎯 Class Teacher Dashboard</h2>
        <ul>
          <li><FiBarChart2 /> Class Marks Overview</li>
          <li><FiUserCheck /> Student List & Attendance</li>
          <li><FiClipboard /> Exam & Assignment Status</li>
          <li><FiAlertCircle /> Low-Performing Students</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h1>📚 Class Teacher Portal</h1>
          <div className="teacher-info">
            <span>👤 Mr. John Doe | CSE - III Year A Section</span>
            <img src="teacher-profile.jpg" alt="Teacher" className="profile-pic" />
          </div>
        </header>

        {/* Dashboard Sections */}
        <section className="dashboard-widgets">
          <div className="widget">
            <h3>📉 Class Performance Graph</h3>
            <div className="chart-placeholder">[Bar Chart Placeholder]</div>
          </div>
          <div className="widget">
            <h3>📌 Attendance Tracker</h3>
            <div className="chart-placeholder">[Pie Chart Placeholder]</div>
          </div>
          <div className="widget notes">
            <h3>📝 Quick Notes for Each Student</h3>
            <textarea placeholder="Add your notes here..." />
          </div>
        </section>
      </main>

      {/* Chatbot Floating Button */}
      <button className="chatbot-btn" onClick={() => setChatOpen(true)}>
        <FiMessageSquare size={24} />
      </button>

      {/* Chatbot Sidebar */}
      {chatOpen && (
        <div className="chatbot-sidebar">
          <div className="chatbot-header">
            <h3>AI Chat Assistant</h3>
            <button className="close-btn" onClick={() => setChatOpen(false)}>
              <FiX size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
            <p className="bot-message">Hello! How can I assist you today?</p>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Type your message..." />
            <button className="send-btn">➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTeacherDashboard;



