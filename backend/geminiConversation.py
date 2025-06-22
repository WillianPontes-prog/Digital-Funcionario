from google import genai
from google.genai import types

client = genai.Client(api_key="YOUR_API_KEY")


def talkTelegram(message: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
        system_instruction="Você é um assistente de IA projetado para interpretar mensagens de usuários e encaminhá-las para o sistema correto, escolhendo um dos três comandos disponíveis."), 
        contents=message, 
    )
    return response.text