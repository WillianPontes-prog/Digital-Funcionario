import logging
import asyncio
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from database import get_company_details

tipoEmpresa = get_company_details().tipo

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

currentTelegramMessage = None

def ler_faq():
    with open('faq.txt', encoding='utf-8') as f:
        faq = f.read()
    return faq.replace('{servico_empresa}', tipoEmpresa)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text="I'm a bot, please talk to me!")

async def save_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global currentTelegramMessage
    currentTelegramMessage = update.message.text
    


if __name__ == '__main__':
    application = ApplicationBuilder().token('7377251673:AAHp--UAvvaL-A7vSoHyKOa1d3NRIpZ33P8').build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), save_message))
    application.run_polling()