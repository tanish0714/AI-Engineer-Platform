from fastapi import FastAPI

from app.core.config import settings

from app.api.chat import router as chat_router
from app.api.document import router as document_router
from app.api.vector import router as vector_router
from app.api.interview import router as interview_router
from app.api.github import router as github_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


# =====================================================
# CHAT
# =====================================================

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"],
)


# =====================================================
# VECTOR
# =====================================================

app.include_router(
    vector_router,
    prefix="/vector",
    tags=["Vector"],
)


# =====================================================
# DOCUMENT
# =====================================================

app.include_router(
    document_router,
    prefix="/document",
    tags=["Document"],
)


# =====================================================
# INTERVIEW
# =====================================================

app.include_router(
    interview_router,
    prefix="/interview",
    tags=["Interview"],
)


# =====================================================
# GITHUB AI
# =====================================================

app.include_router(
    github_router,
)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "success": True,
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "Running",
    }


# =====================================================
# HEALTH
# =====================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
    }