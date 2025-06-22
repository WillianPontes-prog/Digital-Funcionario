import logging
import asyncio
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from database import get_company_details
import geminiConversation

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
    with open('promptTelegram.txt', encoding='utf-8') as f:
        prompt = f.read()
    prompt += '\n\n' + "Mensagem: " + currentTelegramMessage + '\n\n'
    response = geminiConversation.talkTelegram(prompt)

    if response == "retorna_faq":
        faq = ler_faq()
        await context.bot.send_message(chat_id=update.effective_chat.id, text=faq)
    elif "registra_cadastro" in response:
        email = response.split("email: ")[-1].split("senha: ")[0].strip()
        senha = response.split("senha: ")[-1].strip() #eu nao faço ideia de que bruxaria é essa, ver melhor depois 
        print("aqui a gente registra o cadastro")
    elif response == "registra_empresa":
        print("aqui a gente registra a empresa")



if __name__ == '__main__':
    application = ApplicationBuilder().token('7377251673:AAHp--UAvvaL-A7vSoHyKOa1d3NRIpZ33P8').build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), save_message))
    application.run_polling()