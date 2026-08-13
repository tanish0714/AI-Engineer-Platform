from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health():
    return {
        "success": True,
        "message": "AI Service Running 🚀"
    }