import spacy
import re
from db import students_col, mentors_col, teachers_col, hod_col  # Import MongoDB collections

# Load NLP model
nlp = spacy.load("en_core_web_sm")

def find_entity_by_name(name, collection, key):
    """Find an entity in MongoDB collection by name (case-insensitive)."""
    result = collection.find_one({key: {"$regex": f"^{name}$", "$options": "i"}}, {"_id": 0})
    return result

def format_response(entity_type, data):
    """Format response for better readability."""
    if not data:
        return f"🚨 No such {entity_type} found."
    
    response = f"📌 {entity_type} Details:\n"
    for key, value in data.items():
        response += f"  - {key}: {value}\n"
    return response.strip()

def extract_entity_name(query, entity_type):
    """Extract names for students, mentors, teachers, and HOD using regex."""
    doc = nlp(query)

    # Try Spacy NER first
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG"]:
            return ent.text.strip()

    # Regex-based extraction if NER fails
    if entity_type == "Student":
        match = re.search(r"student\s*(\d+)", query, re.IGNORECASE)
        if match:
            return f"Student {match.group(1)}"

    if entity_type == "Mentor":
        match = re.search(r"mentor\s*(\d+)", query, re.IGNORECASE)
        if match:
            return f"Mentor {match.group(1)}"

    if entity_type == "Teacher":
        match = re.search(r"(class teacher|teacher)\s*(\d+)", query, re.IGNORECASE)
        if match:
            return f"Class Teacher {match.group(2)}"

    if entity_type == "HOD":
        if "hod" in query:
            return "HOD"

    return None

def get_semester_gpa(student_data, sem_number):
    """Fetch GPA for a specific semester."""
    sem_key = f"{sem_number} Semester"
    if sem_key in student_data:
        return f"{sem_key} GPA: {student_data[sem_key]}"
    else:
        return f"🚨 No GPA data found for {sem_key}."

def get_all_gpa(student_data):
    """Fetch all semester GPAs."""
    sem_gpa_data = {k: v for k, v in student_data.items() if "Semester" in k}
    if sem_gpa_data:
        gpa_details = "\n".join([f"{k} GPA: {v}" for k, v in sem_gpa_data.items()])
        return gpa_details
    return "🚨 No GPA information found."

def process_query(query):
    """Process user query and fetch details from MongoDB."""
    query = query.lower()

    # **Extract names for each entity type**
    student_name = extract_entity_name(query, "Student")
    mentor_name = extract_entity_name(query, "Mentor")
    teacher_name = extract_entity_name(query, "Teacher")
    hod_name = extract_entity_name(query, "HOD")

    print(f"🧐 Extracted Name - Student: {student_name}, Mentor: {mentor_name}, Teacher: {teacher_name}, HOD: {hod_name}")

    # **Student Queries**
    if "student" in query and student_name:
        student_data = find_entity_by_name(student_name, students_col, "Student Name")
        if not student_data:
            return f"🚨 No data found for {student_name}."

        # **Handle Specific Semester GPA Query**
        sem_match = re.search(r"sem\s*(\d+)", query, re.IGNORECASE)
        if "gpa" in query and sem_match:
            sem_number = sem_match.group(1)
            return get_semester_gpa(student_data, sem_number)

        # **Handle Query for All Semester GPAs**
        elif "gpa" in query:
            return get_all_gpa(student_data)

        # **Handle Attendance Query**
        elif "attendance" in query:
            if "Attendance" in student_data:
                return f"📊 Attendance: {student_data['Attendance']}"
            else:
                return "🚨 No attendance data available."

        # **Return Full Student Details if No Specific Query**
        else:
            return format_response("Student", student_data)

    # **Mentor Queries**
    if "mentor" in query and mentor_name:
        mentor_data = find_entity_by_name(mentor_name, mentors_col, "Name")
        return format_response("Mentor", mentor_data)

    # **Class Teacher Queries**
    if ("teacher" in query or "class teacher" in query) and teacher_name:
        teacher_data = find_entity_by_name(teacher_name, teachers_col, "name")
        return format_response("Teacher", teacher_data)

    # **HOD Queries**
    if "hod" in query and hod_name:
        hod_data = find_entity_by_name("HOD", hod_col, "Name")
        return format_response("HOD", hod_data)

    return "❓ I'm sorry, I don't understand your query."

if __name__ == "__main__":
    print("💬 Chatbot is running! Type 'exit' to quit.")
    while True:
        user_input = input("💬 Ask me a question: ")
        if user_input.lower() == "exit":
            print("👋 Goodbye!")
            break
        response = process_query(user_input)
        print(response)
