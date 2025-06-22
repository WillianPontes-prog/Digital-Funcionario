import sqlalchemy
import pandas as pd

user = "root" 
password = "254883" 
host = "localhost" 
port = 3306
database = "aps"
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
    
def check_login(email: str, password: str):
    with engine.connect() as connection:
        result = connection.execute(
            sqlalchemy.text(
                "SELECT login, senha, tipo FROM user WHERE login = :email AND senha = :password"
            ),
            {"email": email, "password": password}
        )

        resultado = result.fetchone()
        
        if resultado is not None:
            current_user = {"usertype": resultado.tipo}
            current_user = pd.DataFrame([current_user])
            current_user.to_csv('current_user.csv', index=False)
            return True # Retorna True se houver um resultado
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
        print("Usuário Marketing inserido com sucesso!")

