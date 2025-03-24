from flask import Flask, request, jsonify
from chatbot import process_query
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Chatbot API with MongoDB is running!"})

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
