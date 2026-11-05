from sqlalchemy import Column, BigInteger, Text, Numeric, Integer, ForeignKey
from database import Base


# Modelo de categorías
class Category(Base):
    __tablename__ = "categories"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False, unique=True)


# Modelo de marcas
class Brand(Base):
    __tablename__ = "brands"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False, unique=True)


# Modelo de productos
class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    purchase_price = Column(Numeric(10, 2), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)

    category_id = Column(
        BigInteger,
        ForeignKey("categories.id"),
        nullable=False
    )

    brand_id = Column(
        BigInteger,
        ForeignKey("brands.id"),
        nullable=False
    )