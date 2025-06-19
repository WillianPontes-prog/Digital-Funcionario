from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd


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

@app.get("/")
def read_root():
    return {"message": "API funcionando!"}

@app.post("/cadastrarFuncionario")
def processar_dados(item: Funcionario):
    employee = {
        "name": item.name,
        "email": item.email,
        "password": item.password
    }

    df = pd.read_csv("employees.csv")
    df = df._append(employee, ignore_index=True)
    df.to_csv("employees.csv", index=False)

    return employee

@app.post("/cadastrarEmpresa")
def processar_dados(item: Empresa):
    empresa = {
        "name": item.name,
        "tipo": item.tipo}
    
    df = pd.DataFrame([empresa])
    df.to_csv("empresa.csv", index=False)

    return empresa

@app.get("/listarFuncionarios")
def listar_funcionarios():
    try:
        df = pd.read_csv("employees.csv")
        funcionarios = df.to_dict(orient="records")
        return funcionarios
    except FileNotFoundError:
        return {"message": "Nenhum funcionário cadastrado."}