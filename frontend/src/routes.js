import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import ClassTeacherDashboard from "./pages/ClassTeacherDashboard";
import HoDDashboard from "./pages/HoDDashboard";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/class-teacher" element={<ClassTeacherDashboard />} />
        <Route path="/hod" element={<HoDDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;

