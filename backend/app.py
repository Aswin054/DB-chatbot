from flask import Flask, request, jsonify
from chatbot import process_query
from db import students_col  # Import MongoDB collection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# ✅ Route to check API status
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Chatbot API with MongoDB is running!"})


# ✅ Route to handle chatbot queries
@app.route("/chat", methods=["POST"])
def chat():
    """Handle chatbot queries via API."""
    data = request.json

    if not data or "message" not in data:
        return jsonify({"error": "Message field is required"}), 400

    user_input = data["message"]
    session_id = data.get("session_id", "default_session")

    # ✅ Pass session_id for multi-turn conversations
    response = process_query(user_input, session_id)

    return jsonify({"response": response})


# ✅ Route to add new student
@app.route("/add_student", methods=["POST"])
def add_student():
    """Add new student to MongoDB"""
    data = request.json
    student_data = {
        "Student Name": data.get("studentName"),
        "Year": data.get("year"),
        "Class": data.get("class"),
        "Achievements": data.get("achievements"),
        "Mentee": data.get("mentee"),
        "Class Teacher": data.get("classTeacher"),
        "1 Semester": data.get("sem1GPA"),
        "2 Semester": data.get("sem2GPA"),
        "Attendance": data.get("attendance"),
    }
    students_col.insert_one(student_data)
    return jsonify({"message": "✅ Student data added successfully!"})


# ✅ Route to update existing student
@app.route("/update_student", methods=["PUT"])
def update_student():
    """Update existing student in MongoDB"""
    data = request.json
    student_name = data.get("studentName")

    if not student_name:
        return jsonify({"error": "Student Name is required for update"}), 400

    update_data = {
        "Year": data.get("year"),
        "Class": data.get("class"),
        "Achievements": data.get("achievements"),
        "Mentee": data.get("mentee"),
        "Class Teacher": data.get("classTeacher"),
        "1 Semester": data.get("sem1GPA"),
        "2 Semester": data.get("sem2GPA"),
        "Attendance": data.get("attendance"),
    }

    result = students_col.update_one(
        {"Student Name": student_name},
        {"$set": update_data}
    )

    if result.modified_count > 0:
        return jsonify({"message": "✅ Student data updated successfully!"})
    else:
        return jsonify({"error": "⚠️ No student data found to update"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
