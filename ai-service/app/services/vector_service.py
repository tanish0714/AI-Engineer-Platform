import requests
import uuid

from app.core.config import settings


class VectorService:

    def __init__(self):
        self.base_url = settings.QDRANT_URL
        self.api_key = settings.QDRANT_API_KEY

        self.headers = {
            "api-key": self.api_key,
            "Content-Type": "application/json",
        }

        self.collection_name = "document_embeddings"

    # =====================================================
    # CREATE COLLECTION
    # =====================================================

    def create_collection(self):

        url = (
            f"{self.base_url}/collections/"
            f"{self.collection_name}"
        )

        payload = {
            "vectors": {
                "size": 3072,
                "distance": "Cosine",
            }
        }

        response = requests.put(
            url,
            headers=self.headers,
            json=payload,
            timeout=60,
        )

        response.raise_for_status()

        return response.json()

    # =====================================================
    # UPSERT VECTORS
    # =====================================================

    def upsert_vectors(
        self,
        vectors,
        chunks,
        document_id,
        project_id,
        file_name,
    ):

        url = (
            f"{self.base_url}/collections/"
            f"{self.collection_name}/points"
        )

        points = []

        for i, (vector, chunk) in enumerate(
            zip(vectors, chunks)
        ):

            points.append(
                {
                    "id": str(uuid.uuid4()),

                    "vector": vector,

                    "payload": {
                        "documentId": str(document_id),
                        "projectId": str(project_id),
                        "fileName": file_name,
                        "chunkIndex": i,
                        "text": chunk,
                    },
                }
            )

        payload = {
            "points": points
        }

        print("\n========== QDRANT UPSERT ==========")
        print("Collection:", self.collection_name)
        print("Project ID:", project_id)
        print("Document ID:", document_id)
        print("Chunks:", len(chunks))
        print("Vectors:", len(vectors))

        response = requests.put(
            url,
            headers=self.headers,
            json=payload,
            timeout=120,
        )

        print("QDRANT UPSERT STATUS:", response.status_code)
        print("QDRANT UPSERT RESPONSE:", response.text)
        print("===================================\n")

        response.raise_for_status()

        return response.json()

    # =====================================================
    # GET ALL POINTS - DEBUG
    # =====================================================

    def get_all_points(self):

        url = (
            f"{self.base_url}/collections/"
            f"{self.collection_name}/points/scroll"
        )

        payload = {
            "limit": 10,
            "with_payload": True,
            "with_vector": False,
        }

        print("\n========== QDRANT SCROLL ==========")
        print("URL:", url)

        try:

            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=60,
            )

            print("QDRANT SCROLL STATUS:", response.status_code)
            print("QDRANT SCROLL RESPONSE:", response.text)

            if not response.ok:
                raise Exception(
                    f"Qdrant returned "
                    f"{response.status_code}: "
                    f"{response.text}"
                )

            return response.json()

        except requests.RequestException as error:

            print("QDRANT SCROLL ERROR:", error)
            raise

        finally:

            print("===================================\n")

    # =====================================================
    # SEARCH VECTORS
    # =====================================================

    def search_vectors(
        self,
        query_vector,
        project_id,
        limit=5,
    ):

        url = (
            f"{self.base_url}/collections/"
            f"{self.collection_name}/points/search"
        )

        payload = {
            "vector": query_vector,
            "limit": limit,
            "with_payload": True,

            "filter": {
                "must": [
                    {
                        "key": "projectId",
                        "match": {
                            "value": str(project_id)
                        },
                    }
                ]
            },
        }

        print("\n========== QDRANT SEARCH ==========")
        print("Project ID:", project_id)
        print("URL:", url)

        try:

            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=60,
            )

            print("QDRANT STATUS:", response.status_code)
            print("QDRANT RESPONSE:", response.text)

            if not response.ok:
                raise Exception(
                    f"Qdrant returned "
                    f"{response.status_code}: "
                    f"{response.text}"
                )

            return response.json()

        except requests.RequestException as error:

            print("QDRANT REQUEST ERROR:", error)
            raise

        finally:

            print("===================================\n")


vector_service = VectorService()