from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou especifique seu IP/app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para receber dados do app
class Item(BaseModel):
    name: str
    value: int

@app.get("/")
def read_root():
    return {"message": "API funcionando!"}

@app.post("/processar")
def processar_dados(item: Item):
    # Aqui você pode chamar seu script Python, banco de dados, etc.
    resultado = f"Recebi {item.name} com valor {item.value}"
    print(f"o {item.name} roubou pão na casa do {item.value}")
    return {"resultado": resultado}