from fastapi import APIRouter
from repositories.inventory_repository import (
    get_products,
    get_categories,
    add_product,
    update_product,
    update_product_stock,
)

router = APIRouter()

@router.get("/get_products")
def products(
    product_id: int | None = None,
    product_code: str | None = None,
    product_name: str | None = None
):
    return get_products(
        product_id=product_id,
        product_code=product_code,
        product_name=product_name
    )
    
@router.get("/get_categories")
def categories(
    category_id: int | None = None,
    category_name: str | None = None
):
    return get_categories(
        category_id=category_id,
        category_name=category_name
    )

@router.post("/add_product")
def create_product(data: dict):
    result = add_product(
        product_code=data["code"],
        product_name=data["name"],
        category_id=data["category_id"],
        qty=data["qty"],
        price_sell=data["price_sell"],
        price_promo=data.get("price_promo", 0),
        description=data.get("description", None)
    )
    
    if not result:
        return {
            "success": False,
            "message": "Failed to add product"
        }

    return {
        "success": True,
        "message": "Product added"
    }
    
@router.put("/update_product/{product_id}")
def update_existing_product(product_id: int, data: dict):
    result = update_product(
        product_id=product_id,
        product_code=data["code"],
        product_name=data["name"],
        category_id=data["category_id"],
        qty=data["qty"],
        price_sell=data["price_sell"],
        price_promo=data.get("price_promo", 0),
        description=data.get("description", None)
    )

    if not result:
        return {
            "success": False,
            "message": "Failed to update product"
        }

    return {
        "success": True,
        "message": "Product updated"
    }

@router.patch("/update_product_stock/{product_id}")
def update_product_stock_endpoint(product_id: int, data: dict):
    result = update_product_stock(
        product_id=product_id,
        qty=data["qty"]
    )

    if not result:
        return {
            "success": False,
            "message": "Failed to update product stock"
        }

    return {
        "success": True,
        "message": "Product stock updated"
    }

# @router.post("/products")
# def create_product(data: dict):
#     add_product(data["name"], data["price"])

#     return {
#         "message": "Product added"
#     }