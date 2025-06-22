from fastapi import FastAPI, Body, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import database
import shutil
import os

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
    database.add_user_CEO(item.name, item.email, item.password)
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


