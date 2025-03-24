// 📁 src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HoDDashboard from "../pages/HoDDashboard"; // ✅ Correct path
import StudentForm from "../pages/StudentForm";   // ✅ Correct path
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Route for HoDDashboard */}
        <Route path="/" element={<HoDDashboard />} />
        
        {/* ✅ Route for StudentForm */}
        <Route path="/add-student" element={<StudentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
