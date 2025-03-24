# -*- coding: utf-8 -*-
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
from chatbot import process_query  # Import NLP-based query processing

# ✅ Enable logging for debugging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# 🔥 Your actual Telegram bot token
TELEGRAM_BOT_TOKEN = "7703515167:AAFbVa93VFjmD9dzq3vKjjdTjp6LEHf9ktQ"

# ✅ Store user session data for maintaining context
user_sessions = {}

# ✅ /start Command Handler
async def start(update: Update, context: CallbackContext):
    """Send a welcome message when the /start command is issued."""
    user_id = str(update.effective_user.id)  # Unique session ID for each user
    user_sessions[user_id] = {"session_id": user_id}  # Initialize session
    await update.message.reply_text(
        "Hello! 🤖 I'm your AI Chatbot. Ask me about students, mentors, teachers, or HODs!\n"
        "You can also ask me about GPA, attendance, or achievements."
    )

# ✅ Query Handler to Process User Messages
async def handle_query(update: Update, context: CallbackContext):
    """Process user queries and provide responses."""
    user_id = str(update.effective_user.id)  # Unique session for each user
    user_text = update.message.text.strip()

    # ✅ Check if session exists, otherwise create it
    if user_id not in user_sessions:
        user_sessions[user_id] = {"session_id": user_id}

    session_id = user_sessions[user_id]["session_id"]

    # ✅ Pass user text and session_id to process_query()
    try:
        response = process_query(user_text, session_id)
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        response = "⚠️ Oops! Something went wrong. Please try again."

    # ✅ Send response to the user
    await update.message.reply_text(response)

# ✅ Main Function to Start the Bot
def main():
    """Initialize and run the bot using Application (v20+ syntax)."""
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # ✅ Add Command and Message Handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_query))

    # ✅ Start polling for updates
    application.run_polling()

# ✅ Run main() only when the script is executed
if __name__ == "__main__":
    main()
