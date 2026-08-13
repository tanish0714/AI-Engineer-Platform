from qdrant_client import QdrantClient
from app.core.config import settings

qdrant = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
    timeout=60,
    check_compatibility=False,
)