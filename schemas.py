from pydantic import BaseModel, Field

# Esquema para categorías
class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

# Esquema para marcas
class BrandCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

# Esquema para registrar productos
class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    purchase_price: float = Field(ge=0)
    price: float = Field(ge=0)
    stock: int = Field(ge=0)
    category_id: int
    brand_id: int


# Esquema para mostrar productos
class ProductResponse(BaseModel):
    id: int
    name: str
    purchase_price: float
    price: float
    stock: int
    category_id: int
    brand_id: int

    class Config:
        from_attributes = True