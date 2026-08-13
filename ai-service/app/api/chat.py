from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.rag_service import rag_service

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    project_id: str


@router.post("/pdf")
async def chat(request: ChatRequest):

    # =====================================================
    # VALIDATION
    # =====================================================

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    if not request.project_id.strip():
        raise HTTPException(
            status_code=400,
            detail="Project ID is required"
        )

    # =====================================================
    # RAG
    # =====================================================

    try:

        result = rag_service.ask(
            question=request.question.strip(),
            project_id=request.project_id.strip()
        )

        # =================================================
        # RESPONSE
        # =================================================

        return {
            "success": True,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as error:

        print("RAG ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to generate AI response"
        )