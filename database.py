import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Cargar las variables del archivo .env
load_dotenv()

# Obtener la URL de conexión
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el motor de conexión
engine = create_engine(DATABASE_URL)

# Crear sesiones para trabajar con la base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para los modelos de SQLAlchemy
Base = declarative_base()


# Obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()