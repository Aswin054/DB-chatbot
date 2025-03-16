from pymongo import MongoClient

# Connect to MongoDB
try:
    client = MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000")
    client.admin.command('ping')  # Ping MongoDB to check connection
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ Error connecting to MongoDB:", e)
    exit()

# Access Database
db = client["collegedbs"]

# Access Collections
students_col = db["students"]
mentors_col = db["mentors"]
teachers_col = db["teachers"]
hod_col = db["hod"]

# Functions to Get Data
def get_student_data(student_name):
    student = students_col.find_one({"Student Name": student_name}, {"_id": 0})
    return student if student else "🚨 Student Not Found!"

def get_mentor_data(mentor_name):
    mentor = mentors_col.find_one({"Name": mentor_name}, {"_id": 0})
    return mentor if mentor else "🚨 Mentor Not Found!"

def get_teacher_data(teacher_name):
    teacher = teachers_col.find_one({"name": teacher_name}, {"_id": 0})
    return teacher if teacher else "🚨 Teacher Not Found!"

def get_hod_data(hod_name):
    hod = hod_col.find_one({"Name": hod_name}, {"_id": 0})
    return hod if hod else "🚨 HOD Not Found!"

# Test Connection & Collection Names
if __name__ == "__main__":
    print("📂 Available Collections:", db.list_collection_names())

    # Check existing student names
    print("👀 Existing Student Names:", list(students_col.find({}, {"Student Name": 1, "_id": 0})))

    # Test with actual names in DB
    sample_student = get_student_data("Student 2")
    print("👨‍🎓 Sample Student Data:", sample_student)

    sample_mentor = get_mentor_data("Mentor 1")
    print("👨‍🏫 Sample Mentor Data:", sample_mentor)

    sample_teacher = get_teacher_data("Class Teacher 1")
    print("🏫 Sample Teacher Data:", sample_teacher)

    sample_hod = get_hod_data("HOD")
    print("📌 Sample HOD Data:", sample_hod)
