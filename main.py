from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product
from schemas import ProductCreate, ProductResponse

app = FastAPI(
    title="API Librería Montaño",
    description="Backend para la gestión de productos de Librería Montaño",
    version="1.0.0"
)

@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido a la API de Librería Montaño",
        "estado": "Funcionando correctamente"
    }

# Consultar todos los productos
@app.get("/productos", response_model=list[ProductResponse])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Product).all()

# Consultar un producto por su ID
@app.get("/productos/{producto_id}", response_model=ProductResponse)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Product).filter(
        Product.id == producto_id
    ).first()

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return producto

# Registrar un producto
@app.post("/productos", response_model=ProductResponse)
def crear_producto(datos: ProductCreate, db: Session = Depends(get_db)):
    producto = Product(**datos.model_dump())

    db.add(producto)
    db.commit()
    db.refresh(producto)

    return producto

# Actualizar un producto
@app.put("/productos/{producto_id}", response_model=ProductResponse)
def actualizar_producto(
    producto_id: int,
    datos: ProductCreate,
    db: Session = Depends(get_db)
):
    producto = db.query(Product).filter(
        Product.id == producto_id
    ).first()

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for campo, valor in datos.model_dump().items():
        setattr(producto, campo, valor)

    db.commit()
    db.refresh(producto)

    return producto

# Eliminar un producto
@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Product).filter(
        Product.id == producto_id
    ).first()

    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(producto)
    db.commit()

    return {"mensaje": "Producto eliminado correctamente"}