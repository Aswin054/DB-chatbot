import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
from chatbot import process_query  # Import NLP-based query processing

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Replace with your actual bot token
TELEGRAM_BOT_TOKEN = "7703515167:AAFbVa93VFjmD9dzq3vKjjdTjp6LEHf9ktQ"

# Command handler for /start
async def start(update: Update, context: CallbackContext):
    """Send a welcome message when the /start command is issued."""
    await update.message.reply_text("Hello! I'm your bot. Ask me about students, mentors, teachers, or HODs!")

# Message handler to process queries using NLP
async def handle_query(update: Update, context: CallbackContext):
    """Process user queries using chatbot's NLP model."""
    user_text = update.message.text.strip()
    response = process_query(user_text)  # Process query via chatbot.py
    await update.message.reply_text(response)

# Main function to start the bot
def main():
    """Initialize and run the bot using Application (v20+ syntax)."""
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Add command and message handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_query))

    # Start polling for updates
    application.run_polling()

if __name__ == "__main__":
    main()
