from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.core.config import settings


class EmbeddingService:

    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=settings.GEMINI_API_KEY,
        )

    def embed_documents(self, chunks: list[str]):
        return self.embeddings.embed_documents(chunks)

    def embed_query(self, query: str):
        return self.embeddings.embed_query(query)


embedding_service = EmbeddingService()