from fastapi import APIRouter
import bcrypt
from repositories.inventory_repository import (
    get_products,
    get_categories,
    add_product,
    get_users,
    add_user,
    edit_user,
    update_product,
    update_product_stock,
    get_transactions
)

router = APIRouter()

# PRODUCTS
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

# TRANSACTIONS
@router.get("/get_transactions")
def transactions(
    id: int | None = None,
    transaction_number: str | None = None,
    customer_name: str | None = None
):
    return get_transactions(
        id=id,
        transaction_number=transaction_number,
        customer_name=customer_name
    )
    
# USERS
@router.get("/get_users")
def users(
    user_id: int | None = None,
    username: str | None = None,
    role: str | None = None
):
    return get_users(
        user_id=user_id,
        username=username,
        role=role
    )
    
@router.patch("/update_user/{user_id}")
def update_user(user_id: int, data: dict):
    password = None
    if data.get("password"):
        # Hash the password using bcrypt
        password = bcrypt.hashpw(data.get("password").encode('utf-8'), bcrypt.gensalt())
        
    result = edit_user(
        user_id=user_id,
        name=data.get("name"),
        username=data.get("username"),
        password= password,
        role=data.get("role"),
        is_active=data.get("is_active"),
    )
    
    if not result:
        return {
            "success": False,
            "message": "Failed to update user"
        }

    return {
        "success": True,
        "message": "User updated"
    }
    
@router.post("/add_user")
def create_user(data: dict):
    result = add_user(
        name=data["name"],
        username=data["username"],
        password=bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt()),
        role=data["role"],
        is_active=data.get("is_active", True)
    )
    
    if not result:
        return {
            "success": False,
            "message": "Failed to add user"
        }
        
    return {
        "success": True,
        "message": "User added"
    }