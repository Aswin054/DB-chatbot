import React, { useState } from "react";
import axios from "axios";
import "./StudentForm.css"

const StudentForm = ({ isUpdate = false }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    year: "",
    class: "",
    achievements: "",
    mentee: "",
    classTeacher: "",
    sem1GPA: "",
    sem2GPA: "",
    attendance: "",
  });

  // 💡 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💡 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isUpdate
      ? "http://127.0.0.1:5000/update_student" // PUT for update
      : "http://127.0.0.1:5000/add_student"; // POST for adding

    try {
      const response = await axios({
        method: isUpdate ? "PUT" : "POST",
        url,
        data: formData,
      });

      alert(response.data.message);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to process the request.");
    }
  };

  return (
    <div className="form-container">
      <h2>{isUpdate ? "Update Student Data" : "Add New Student"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="achievements"
          placeholder="Achievements"
          value={formData.achievements}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mentee"
          placeholder="Mentee"
          value={formData.mentee}
          onChange={handleChange}
        />
        <input
          type="text"
          name="classTeacher"
          placeholder="Class Teacher"
          value={formData.classTeacher}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sem1GPA"
          placeholder="Semester 1 GPA"
          value={formData.sem1GPA}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sem2GPA"
          placeholder="Semester 2 GPA"
          value={formData.sem2GPA}
          onChange={handleChange}
        />
        <input
          type="text"
          name="attendance"
          placeholder="Attendance (%)"
          value={formData.attendance}
          onChange={handleChange}
        />
        <button type="submit">{isUpdate ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default StudentForm;
