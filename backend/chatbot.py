import spacy
import re
from db import students_col, mentors_col, teachers_col, hod_col  # Import MongoDB collections

# ✅ Predefined Response Templates for Better Conversation
response_templates = {
    "Student": (
        "Great! I found the details for {Student Name} 😊\n"
        "They are currently in {Year} and belong to class {Class}.\n"
        "They have achieved: {Achievements} 🎯\n"
        "Their mentor is {Mentee} and the class teacher is {Class Teacher}. \n"
        "Would you like to know about their GPA or attendance next? 🤔"
    ),
    "Mentor": (
        "Here's what I know about {Name} 👩‍🏫\n"
        "They are mentoring {No_of_Mentees} students. Would you like to ask anything else?"
    ),
    "Teacher": (
        "{name} is a class teacher for the {department} department 🧑‍🏫.\n"
        "They teach {subject} and have {experience} years of experience.\n"
        "You can contact them at {email}. Anything else you'd like to ask?"
    ),
    "HOD": (
        "The HOD is {Name} 🎓. They specialize in {Specialization} from {University}."
    ),
    "GPA": (
        "📚 {sem_key} GPA for {Student Name} is {gpa}. Would you like to know about another semester? 😉"
    ),
    "Attendance": (
        "📊 Attendance for {Student Name} is {Attendance}. Do you want to check GPA or achievements? 🎯"
    ),
}

# ✅ Load NLP model
nlp = spacy.load("en_core_web_sm")

# ✅ Conversation Memory to Store Context
conversation_memory = {}


def find_entity_by_name(name, collection, key):
    """Find an entity in MongoDB collection by name (case-insensitive)."""
    try:
        result = collection.find_one({key: {"$regex": f"^{name}$", "$options": "i"}}, {"_id": 0})
        return result
    except Exception as e:
        print(f"⚠️ Error querying database: {e}")
        return None


def format_response(entity_type, data, extra_info=None):
    """Format response dynamically using templates."""
    if not data:
        return f"🚨 No such {entity_type} found. Please check and try again."

    # Check if template is available for the entity
    if entity_type in response_templates:
        # Use dynamic placeholders from MongoDB data
        return response_templates[entity_type].format(**data)

    # Handle extra info like GPA or attendance dynamically
    if entity_type == "GPA" and extra_info:
        return response_templates["GPA"].format(
            sem_key=extra_info["sem_key"],
            gpa=extra_info["gpa"],
            **data
        )

    if entity_type == "Attendance" and "Attendance" in data:
        return response_templates["Attendance"].format(**data)

    # Default response if no template matches
    return "🤔 I couldn't process that. Can you clarify your question?"


def extract_entity_name(query, entity_type):
    """Extract names for students, mentors, teachers, and HOD using regex."""
    doc = nlp(query)

    # Try Spacy NER first
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG"]:
            return ent.text.strip()

    # Regex-based extraction if NER fails
    patterns = {
        "Student": r"student\s*(\d+)",
        "Mentor": r"mentor\s*(\d+)",
        "Teacher": r"(?:class\s*teacher|teacher)\s*(\d+|[a-zA-Z]+)",  # ✅ Corrected pattern for Teacher
        "HOD": r"hod"
    }

    pattern = patterns.get(entity_type)
    if pattern:
        match = re.search(pattern, query, re.IGNORECASE)
        if match:
            if entity_type == "HOD":
                return "HOD"
            return f"{entity_type} {match.group(1)}"

    return None


def extract_student_semester(query):
    """Extract student ID and semester from the query."""
    student_match = re.search(r"student\s*(\d+)", query, re.IGNORECASE)
    semester_match = re.search(r"(?:sem|semester)\s*(\d+)", query, re.IGNORECASE)

    student_id = student_match.group(1) if student_match else None
    semester_number = semester_match.group(1) if semester_match else None

    return student_id, semester_number


def get_semester_gpa(student_data, sem_number):
    """Fetch GPA for a specific semester."""
    sem_key = f"{sem_number} Semester"
    return f"🎯 {sem_key} GPA: {student_data.get(sem_key, 'No GPA data found')}."


def get_all_gpa(student_data):
    """Fetch all semester GPAs."""
    sem_gpa_data = {k: v for k, v in student_data.items() if "Semester" in k}
    if sem_gpa_data:
        gpa_details = "\n".join([f"{k} GPA: {v}" for k, v in sem_gpa_data.items()])
        return gpa_details
    return "🚨 No GPA information found."


def process_query(query, session_id):
    """Process user query and fetch details from MongoDB."""
    query = query.lower().strip()

    # ✅ Use conversation memory to maintain context
    memory = conversation_memory.get(session_id, {})
    last_entity = memory.get("entity_type")
    last_data = memory.get("data")

    # **Extract names for each entity type**
    entity_types = ["Student", "Mentor", "Teacher", "HOD"]
    entity_name = None
    entity_type = None

    for et in entity_types:
        entity_name = extract_entity_name(query, et)
        if entity_name:
            entity_type = et
            break

    print(f"🧐 Extracted Name - {entity_type}: {entity_name}")

    # ✅ Auto-prefix 'Class Teacher' for numeric teacher queries
    if entity_type == "Teacher" and entity_name and entity_name.replace("Teacher ", "").isdigit():
        entity_name = f"Class Teacher {entity_name.replace('Teacher ', '')}"

    # ✅ Query MongoDB if entity name is found
    if entity_name and entity_type:
        collection_map = {
            "Student": (students_col, "Student Name"),
            "Mentor": (mentors_col, "Name"),
            "Teacher": (teachers_col, "name"),  # ✅ Corrected here
            "HOD": (hod_col, "Name"),
        }
        collection, key = collection_map[entity_type]
        entity_data = find_entity_by_name(entity_name, collection, key)

        # ✅ Check if data is found and valid response template exists
        if entity_data:
            if entity_type and entity_type in response_templates:
                conversation_memory[session_id] = {"entity_type": entity_type, "data": entity_data}
                return format_response(entity_type, entity_data)
            else:
                return f"❗ Entity type '{entity_type}' not recognized or missing response format."

        # 🚨 Return if no data is found
        return f"🚨 No data found for '{entity_name}'."

    # ✅ Queries about specific semesters
    student_id, sem_number = extract_student_semester(query)
    if student_id and sem_number:
        student_data = find_entity_by_name(f"Student {student_id}", students_col, "Student Name")
        if student_data:
            return get_semester_gpa(student_data, sem_number)
        return f"🚨 No data found for Student {student_id}."

    # ✅ Follow-up Queries (Context-based Queries)
    if last_entity == "Student" and last_data:
        # GPA or Result Queries
        if any(keyword in query for keyword in ["gpa", "result", "marks"]):
            sem_match = re.search(r"(?:sem|semester)\s*(\d+)", query, re.IGNORECASE)
            if sem_match:
                sem_number = sem_match.group(1)
                return get_semester_gpa(last_data, sem_number)
            return get_all_gpa(last_data)

        # Attendance Queries
        if any(keyword in query for keyword in ["attendance", "present"]):
            return f"📊 Attendance: {last_data.get('Attendance', 'No attendance data available.')}"

        # Achievement Queries
        if any(keyword in query for keyword in ["achievements", "awards"]):
            return f"🏆 Achievements: {last_data.get('Achievements', 'No achievements found')}"

        # Mentor Queries
        if any(keyword in query for keyword in ["mentor", "guide"]):
            return f"👨‍🏫 Mentor: {last_data.get('Mentee', 'No mentor assigned')}"

        # Class Teacher Queries
        if any(keyword in query for keyword in ["class teacher", "teacher"]):
            return f"🏫 Class Teacher: {last_data.get('Class Teacher', 'No class teacher assigned')}"

    # ✅ Handle ambiguous or unclear queries
    if last_entity:
        if any(keyword in query for keyword in ["details", "information", "data"]):
            return format_response(last_entity, last_data)

    # 🛑 Default fallback for unrecognized queries
    return "❓ I'm sorry, I don't understand your query. Can you be more specific?"


if __name__ == "__main__":
    print("💬 Chatbot is running! Type 'exit' to quit.")
    while True:
        user_input = input("💬 Ask me a question: ")
        if user_input.lower() == "exit":
            print("👋 Goodbye!")
            break
        response = process_query(user_input, "test_session")
        print(response)
