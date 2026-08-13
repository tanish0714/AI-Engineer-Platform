from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service
from app.services.chat_service import chat_service


class RAGService:

    def ask(self, question: str, project_id: str):

        # =====================================================
        # STEP 1 — EMBED QUESTION
        # =====================================================

        query_vector = embedding_service.embed_query(question)

        # =====================================================
        # STEP 2 — SEARCH QDRANT
        # =====================================================

        results = vector_service.search_vectors(
            query_vector=query_vector,
            project_id=project_id,
            limit=5
        )

        print("\n========== RAG SEARCH RESULTS ==========")
        print(results)

        # =====================================================
        # STEP 3 — EXTRACT RESULTS
        # =====================================================

        search_results = results.get("result", [])

        if isinstance(search_results, dict):
            search_results = search_results.get("points", [])

        contexts = []
        sources = []

        for point in search_results:

            payload = point.get("payload", {})

            text = payload.get("text")

            if not text:
                continue

            # Add text for LLM context
            contexts.append(text)

            # Add source metadata
            sources.append({
                "documentId": payload.get("documentId"),
                "fileName": payload.get("fileName"),
                "chunkIndex": payload.get("chunkIndex"),
            })

        # =====================================================
        # STEP 4 — NO CONTEXT
        # =====================================================

        if not contexts:

            return {
                "answer": "I couldn't find this information in the uploaded documents.",
                "sources": []
            }

        # =====================================================
        # STEP 5 — BUILD CONTEXT
        # =====================================================

        context = "\n\n".join(contexts)

        # =====================================================
        # STEP 6 — PROMPT
        # =====================================================

        prompt = f"""
You are an AI assistant.

Answer ONLY from the given context.

If the answer is not present in the context, reply:

"I couldn't find this information in the uploaded documents."

Context:
{context}

Question:
{question}
"""

        # =====================================================
        # STEP 7 — GEMINI
        # =====================================================

        answer = chat_service.generate(prompt)

        # =====================================================
        # STEP 8 — RETURN ANSWER + SOURCES
        # =====================================================

        return {
            "answer": answer,
            "sources": sources
        }


rag_service = RAGService()