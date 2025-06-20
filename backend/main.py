from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import database

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