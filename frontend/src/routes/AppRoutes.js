import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import StudentDashboard from "../pages/StudentDashboard";
import ClassTeacherDashboard from "../pages/ClassTeacherDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import HoDDashboard from "../pages/HoDDashboard";
import StudentForm from "../pages/StudentForm";

const AppRoutes = () => {
  const [user, setUser] = useState(null); // Track logged-in user

  // Function to handle login
  const handleLogin = (email) => {
    console.log("Login Successful:", email); // Debug to check login
    setUser(email);
  };

  // Redirect to appropriate dashboard
  const getDashboardPath = (email) => {
    switch (email) {
      case "student@gmail.com":
        return "/student";
      case "classteacher@gmail.com":
        return "/classteacher";
      case "mentor@gmail.com":
        return "/mentor";
      case "hod@gmail.com":
        return "/hod";
      default:
        return "/";
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={user ? <Navigate to={getDashboardPath(user)} /> : <Navigate to="/" />}
        />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/classteacher" element={<ClassTeacherDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/hod" element={<HoDDashboard />} />
        <Route path="/add-student" element={<StudentForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
