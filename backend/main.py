from fastapi import FastAPI, Body, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import database
import shutil
import os
from geminiConversation import TalkChat
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou especifique seu IP/app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para receber dados do app
class Funcionario(BaseModel):
    name: str
    email: str
    password: str

class Empresa(BaseModel):
    name: str
    tipo: str

class Login(BaseModel):
    email: str
    password: str

class CEO(BaseModel):
    name: str
    email: str
    password: str
    
class CalendarEvent(BaseModel):
    date: str
    title: str
    description: str
    color: str

class Instagram(BaseModel):
    username: str
    password: str

class WhatsApp(BaseModel):
    phone_number: str

class Message(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "API funcionando!"}

@app.post("/cadastrarFuncionario")
def processar_dados(item: Funcionario):
    database.insert_employee(item.name, item.email, item.password)
    database.add_user_marketing(item.email, item.password, item.name)

@app.post("/cadastrarEmpresa")
def processar_empresa(item: Empresa):
    database.update_empresa(item.name, item.tipo)
    

@app.get("/listarFuncionarios")
def listar_funcionarios():
    funcionarios = database.get_all_employees()
    if funcionarios:
        return funcionarios
    else:
        return {"message": "Nenhum funcionário cadastrado."}
    
@app.post("/loginESenha")
def get_login(item: Login):
    email = item.email
    password = item.password
    if database.check_login(email, password):
        return {"status": 200}
    else:
        return {"status": 401}

@app.post("/registrarCEO")
def registrar_ceo(item: CEO):
    database.add_user_CEO( item.email, item.password, item.name)
    database.check_login(item.email, item.password)

@app.get("/getCurrentUser")
def get_current_user():
   
    current_user = pd.read_csv('current_user.csv')
    if not current_user.empty:
        return current_user.to_dict(orient='records')[0]  # Retorna o primeiro registro como dicionário
    else:
        return {"message": "Nenhum usuário atual encontrado."}
    
@app.get("/getCompanyDetails")
def get_company_details():
    company_details = database.get_company_details()
    return company_details if company_details else {"message": "Nenhuma empresa cadastrada."}

@app.post("/calendar/add")
def add_event(event: CalendarEvent):
    database.add_calendar_event(event.date, event.title, event.description, event.color)
    return {"status": "ok"}

@app.get("/calendar/all")
def get_events():
    return database.get_calendar_events()

@app.post("/calendar/delete")
def delete_event(date: str = Body(...)):
    database.delete_calendar_event(date)
    return {"status": "deleted"}

@app.post("/uploadRelatorio")
def upload_relatorio(
    file: UploadFile = File(None)
):
    caminho_arquivo = ""
    if file:
        pasta_destino = "relatorios"
        os.makedirs(pasta_destino, exist_ok=True)
        caminho_arquivo = os.path.join(pasta_destino, file.filename)
        with open(caminho_arquivo, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        nome_arquivo = file.filename
    else:
        nome_arquivo = "Relatório sem arquivo"

    # Insere tudo no banco mesmo sem o arquivo
    database.inserir_relatorio(
        nome_arquivo=nome_arquivo,
        caminho=caminho_arquivo,
        enviado_por= pd.read_csv('current_user.csv')['name'].values[0],
        descricao= "ok"
    )

    return {"message": "Relatório enviado com sucesso!"}

@app.post("/configurarInstagram")
def configurar_instagram(data: Instagram):
    database.salvar_instagram_config(data.username, data.password)
    return {"status": "Instagram configurado"}

@app.post("/configurarWhatsapp")
def configurar_whatsapp(data: WhatsApp):
    database.salvar_whatsapp_config(data.phone_number)
    return {"status": "WhatsApp configurado"}

@app.get("/getInstagram")
def get_instagram():
    instagram_data = database.get_instagram()
    return instagram_data if instagram_data else {"message": "Nenhum Instagram cadastrado."}

@app.get("/getWhatsapp")
def get_whatsapp():
    whatsapp_data = database.get_whatsapp()
    return whatsapp_data if whatsapp_data else {"message": "Nenhum WhatsApp cadastrado."}

@app.post("/mandarMensagem")
def get_msg(message: Message):
    import random
    
    with open('promptChat.txt', encoding='utf-8') as f:
        prompt = f.read()
    prompt += '\n\n' + "Mensagem: " + message.message + '\n\n'
    
    response = TalkChat(prompt)

    if "criar_relatorio" in response:
        return {"name": "criar_relatorio"}
    
    elif "listar_funcionarios" in response:
        employeelist = database.get_all_employees()
        sendMessage = "Lista de funcionários:\n" + "\n".join([f"{emp['name']} - {emp['email']}" for emp in employeelist])
        return {"name": sendMessage}

    elif "adicionar_postagem_calendario" in response:
        # Exemplo de response: "adicionar_postagem_calendario data: 27/07 titulo: Podridão descricao: escarlate"
        calendarData = response.split("adicionar_postagem_calendario")[1].strip()
        # Usando regex para extrair os campos
        match = re.search(r'data:\s*([^\s]+)\s+titulo:\s*([^\s]+.*?)\s+descricao:\s*(.+)', calendarData)
        if match:
            calendarDate = match.group(1).strip()
            calendarTitle = match.group(2).strip()
            calendarDescription = match.group(3).strip()
            database.add_calendar_event(
                date=calendarDate,
                title=calendarTitle,
                description=calendarDescription,
                color="#B30CC2"  
            )
            return {"name": "Postagem adicionada ao calendário com sucesso!"}
        else:
            return {"name": "Formato inválido para adicionar postagem no calendário."}
    
    elif "exibir_ajuda" in response:
        # Ajuda resumida
        ajuda_completa = """🦅 URUBU DO PIX - AJUDA 🦅

Posso te ajudar com:
• Relatórios e arquivos
• Lista de funcionários  
• Calendário e eventos
• Configurar redes sociais
• Responder dúvidas

Digite naturalmente o que precisa, ex:
"criar relatório", "mostrar funcionários", "meu nome"

Qualquer dúvida, só perguntar!"""
        
        return {"name": ajuda_completa}

    elif "responder_nome" in response:
        # Lista pequena de respostas apresentando o nome
        respostas_nome = [
            "Sou o Urubu do Pix",
            "Meu nome é Urubu do Pix",
            "Urubu do Pix, prazer",
            "Pode me chamar de Urubu do Pix",
            "Urubu do Pix aqui"
        ]
        
        resposta_nome_aleatoria = random.choice(respostas_nome)
        return {"name": resposta_nome_aleatoria}
    else:
        # Lista de respostas engraçadas para quando não entender
        respostas_engracadas = [
            # Estilo mineiro
            "Uai sô, num intendi foi nada não, cê pode falar de novo aí?",
            "Trem doido esse, num sei nem por onde começar a intender",
            "Ocê tá falando grego ou é coisa da minha cabeça mesmo?",
            "Sô, cê tá querendo me confundir ou eu que sou meio leso mesmo?",
            "Uai, isso aí é mais difícil que subir em árvore de cabeça pra baixo",
            
            # Estilo tristeza existencial
            "Não entendi, mas pelo menos isso combina com o resto da minha vida",
            "Como se a vida já não fosse complicada o suficiente, agora você vem com isso",
            "Ah, mais uma coisa que não entendo... junta com o resto das frustrações da vida",
            "Não sei o que é pior: não entender você ou entender a vida",
            "Pelo menos minha confusão é constante, isso já é alguma coisa",
            
            # Estilo carioca/RJ
            "Rapaz, tu tá zoando comigo ou é sério mesmo essa pergunta aí?",
            "Mano, tu falou grego agora... não entendi foi nada não",
            "Cara, tu tá de sacanagem comigo né? Não dá pra entender isso não",
            "Poxa mano, fala português que eu sou brasileiro também",
            "Tu tá querendo me deixar maluco ou eu já sou assim mesmo?",
            
            # Estilo Chico Bento
            "Caramba, isso aí é mais difíci que pegar sapo no brejo",
            "Nossa, num entendi nada, parece coisa de gente da cidade grande",
            "Esse negócio aí é mais complicado que plantar milho na seca",
            "Puxa vida, isso é mais confuso que galinha tonta no terreiro",
            "Ixe, tô mais perdido que bezerro desmamado",
            
            # Outros engraçados sem emoji
            "Meu cérebro deu blue screen tentando processar isso",
            "Acho que preciso de um manual de instruções pra entender você",
            "Isso é mais complexo que manual de videocassete dos anos 90",
            "Tô mais confuso que GPS sem internet",
            "Minha capacidade de compreensão saiu pra almoçar e não voltou",
            "Isso é mais difícil de entender que a lógica feminina",
            "Estou processando... ainda processando... erro na matrix",
            "Meu QI abaixou tanto que chegou em números negativos",
            "Preciso de um tradutor de confusão pra português claro",
            "Minha inteligência artificial virou inteligência artesanal",
            "Melhor perguntar pro Willian"
        ]
        
        resposta_aleatoria = random.choice(respostas_engracadas)
        return {"name": resposta_aleatoria}



