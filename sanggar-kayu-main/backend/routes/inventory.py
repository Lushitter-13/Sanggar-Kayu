from fastapi import APIRouter
from repositories.inventory_repository import (
    get_products,
    add_product
)

router = APIRouter()

@router.get("/products")
def products():
    return get_products()


@router.post("/products")
def create_product(data: dict):
    add_product(data["name"], data["price"])

    return {
        "message": "Product added"
    }