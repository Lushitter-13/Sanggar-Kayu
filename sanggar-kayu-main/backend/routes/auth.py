from fastapi import APIRouter, HTTPException
from repositories.auth_repository import get_user_by_username
import bcrypt

router = APIRouter()

@router.post("/login")
def login(data: dict):
    username = data["username"]
    password = data["password"]
    
    user = get_user_by_username(username)
    
    if not user:
        return {
            "success": False,
            "message": "Username/password salah"
        }
    
    if not user["is_active"]:
        return {
            "success": False,
            "message": "User tidak aktif"
        }
        
    password_match = bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8"))
    
    if not password_match:
        return {
            "success": False,
            "message": "Username/password salah"
        }
        
    return {
        "success": True,
        "message": "Login berhasil",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "name": user["name"],
            "role": user["role"],
        }
    }
    
@router.post("/logout")
def logout():
    return {
        "success": True,
        "message": "Logout berhasil"
    }