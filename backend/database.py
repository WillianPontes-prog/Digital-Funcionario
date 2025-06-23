import sqlalchemy
import pandas as pd
import os
import setEnvs

user = os.environ["user"]
password = os.environ["password"] 
host = os.environ["host"] 
port = os.environ["port"]
database = os.environ["database"]
DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
engine = sqlalchemy.create_engine(DATABASE_URL)


with engine.begin() as connection:
    # Cria a tabela employees, se não existir
    connection.execute(sqlalchemy.text("""
    CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )
    """))

    # Cria a tabela empresa (company), se não existir
    connection.execute(sqlalchemy.text("""
        CREATE TABLE IF NOT EXISTS empresa (
            id INT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            tipo VARCHAR(255) NOT NULL
        )
    """))

    # Insere uma única empresa com nome "name" e tipo "opcao1", se ainda não existir
    connection.execute(sqlalchemy.text("""
        INSERT INTO empresa (id, nome, tipo)
        SELECT 1, 'name', 'opcao1'
        WHERE NOT EXISTS (
            SELECT 1 FROM empresa WHERE id = 1
        )
    """))

     # Cria a tabela User, se não existir, com tipo ENUM
    connection.execute(sqlalchemy.text("""
        CREATE TABLE IF NOT EXISTS User (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            tipo ENUM('Marketing', 'CEO') NOT NULL,
            nome VARCHAR(255) NOT NULL
        )
    """))

    # Insere usuários padrão, se ainda não existirem
    connection.execute(sqlalchemy.text("""
        INSERT IGNORE INTO User (login, senha, tipo, nome)
        VALUES 
            ('wpontes@alunos.utfpr.edu.br', 'will123', 'Marketing', 'Willian Pontes'),
            ('Jharrison@alunos.utfpr.edu.br', 'eusoubundao', 'CEO', 'John William')
    """))
        
    # Cria a tabela de eventos do calendário, se não existir
    connection.execute(sqlalchemy.text("""
        CREATE TABLE IF NOT EXISTS calendar_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date VARCHAR(10) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            color VARCHAR(16) NOT NULL
        )
    """))

    connection.execute(sqlalchemy.text("""
        CREATE TABLE IF NOT EXISTS relatorios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome_arquivo VARCHAR(255),
            caminho_arquivo TEXT,
            data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
            enviado_por VARCHAR(100),
            descricao TEXT
            )
    """))

    connection.execute(sqlalchemy.text("""
        CREATE TABLE IF NOT EXISTS clientes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            senha VARCHAR(255) NOT NULL
        )
    """))

    connection.execute(sqlalchemy.text("""
        CREATE TABLE IF NOT EXISTS pedidos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            pedido VARCHAR(255) NOT NULL,
            dataDeEnvio DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            enviado_por VARCHAR(100) NOT NULL
        )
    """))


def insert_employee(name: str, email: str, password: str):
    with engine.begin() as connection:  # Usa begin() para garantir o commit automático
        connection.execute(
            sqlalchemy.text(
                "INSERT INTO employees (name, email, password) VALUES (:name, :email, :password)"
            ),
            {"name": name, "email": email, "password": password}
        )
        print("Funcionário inserido com sucesso!")

def update_empresa(nome: str, tipo: str):
    with engine.begin() as connection:
        connection.execute(
            sqlalchemy.text(
                "UPDATE empresa SET nome = :nome, tipo = :tipo WHERE id = 1"
            ),
            {"nome": nome, "tipo": tipo}
        )
        print("Empresa atualizada com sucesso!")

def get_all_employees():
    with engine.connect() as connection:
        result = connection.execute(
            sqlalchemy.text("SELECT id, name, email FROM employees")
        )
        employees = [
            {"id": row.id, "name": row.name, "email": row.email}
            for row in result
        ]
        return employees
    
def get_company_details():
    with engine.connect() as connection:
        result = connection.execute(
            sqlalchemy.text("SELECT * FROM empresa")
        )
        company_details = result.fetchone()
        if company_details:
            return {
                "nome": company_details.nome,
                "tipo": company_details.tipo
            }
        else:
            return None
    
def check_login(email: str, password: str):
    with engine.connect() as connection:
        result = connection.execute(
            sqlalchemy.text(
                "SELECT login, senha, nome, tipo FROM user WHERE login = :email AND senha = :password"
            ),
            {"email": email, "password": password}
        )

        resultado = result.fetchone()
        
        if resultado is not None:
            set_user_type(resultado.tipo, resultado.nome)
            return True # Retorna True se houver um resultado
        print("Login ou senha incorretos.")
        return False
    

def add_user_marketing(login: str, senha: str, nome: str):
    with engine.begin() as connection:
        connection.execute(
            sqlalchemy.text(
                "INSERT INTO User (login, senha, tipo, nome) VALUES (:login, :senha, 'Marketing', :nome)"
            ),
            {"login": login, "senha": senha, "nome": nome}
        )
        print("Usuário Marketing inserido com sucesso!")

def add_user_CEO(login: str, senha: str, nome: str):
    with engine.begin() as connection:
        connection.execute(
            sqlalchemy.text(
                "INSERT INTO User (login, senha, tipo, nome) VALUES (:login, :senha, 'CEO', :nome)"
            ),
            {"login": login, "senha": senha, "nome": nome}
        )
        set_user_type('CEO', nome)

def set_user_type(typeUser, name):
    current_user = {"usertype": typeUser, "name": name}
    current_user = pd.DataFrame([current_user])
    current_user.to_csv('current_user.csv', index=False)

def add_calendar_event(date: str, title: str, description: str, color: str):
    with engine.begin() as connection:
        connection.execute(
            sqlalchemy.text(
                "INSERT INTO calendar_events (date, title, description, color) VALUES (:date, :title, :description, :color)"
            ),
            {"date": date, "title": title, "description": description, "color": color}
        )

def get_calendar_events():
    with engine.connect() as connection:
        result = connection.execute(
            sqlalchemy.text("SELECT date, title, description, color FROM calendar_events")
        )
        events = [
            {"date": row.date, "title": row.title, "description": row.description, "color": row.color}
            for row in result
        ]
        return events

def delete_calendar_event(date: str):
    with engine.begin() as connection:
        connection.execute(
            sqlalchemy.text(
                "DELETE FROM calendar_events WHERE date = :date"
            ),
            {"date": date}
        )

def inserir_relatorio(nome_arquivo, caminho, enviado_por, descricao):
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO relatorios (nome_arquivo, caminho_arquivo, enviado_por, descricao)
            VALUES (:nome, :caminho, :enviado, :descricao)
        """), {
            "nome": nome_arquivo,
            "caminho": caminho,
            "enviado": enviado_por,
            "descricao": descricao
        })

def inserir_cliente(email, senha):
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO clientes (email, senha)
            VALUES (:email, :senha)
        """), {
            "email": email,
            "senha": senha
        })

def inserir_pedido(pedido, enviado_por):
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO pedidos (pedido, enviado_por)
            VALUES (:pedido, :enviado_por)
        """), {
            "pedido": pedido,
            "enviado_por": enviado_por
        })