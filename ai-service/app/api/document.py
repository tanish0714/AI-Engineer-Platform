from fastapi import APIRouter, HTTPException

from app.schemas.document_schema import ProcessDocumentRequest

from app.services.pdf_service import pdf_service
from app.services.chunk_service import chunk_service
from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service

router = APIRouter()


@router.post("/process")
async def process_document(request: ProcessDocumentRequest):

    try:
        # 1. Extract text from document
        text = pdf_service.extract_text(request.file_path)

        if not text.strip():
            raise Exception("No text could be extracted from the document")

        # 2. Split text into chunks
        chunks = chunk_service.split(text)

        if not chunks:
            raise Exception("No chunks could be created from the document")

        # 3. Generate embeddings
        vectors = embedding_service.embed_documents(chunks)

        if not vectors:
            raise Exception("No embeddings could be generated")

        # 4. Store vectors in existing Qdrant collection
        result = vector_service.upsert_vectors(
            vectors=vectors,
            chunks=chunks,
            document_id=request.document_id,
            project_id=request.project_id,
            file_name=request.file_name,
        )

        return {
            "success": True,
            "message": "Document processed successfully",
            "chunks": len(chunks),
            "vectors": len(vectors),
            "qdrant": result,
        }

    except Exception as error:

        print("DOCUMENT PROCESS ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )