from fastapi import APIRouter

from app.services.vector_service import vector_service

router = APIRouter()


@router.post("/create")
async def create_collection():

    result = vector_service.create_collection()

    return result