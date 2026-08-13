from pydantic import BaseModel

class ProcessDocumentRequest(BaseModel):
    file_path: str
    document_id: str
    project_id: str
    file_name: str