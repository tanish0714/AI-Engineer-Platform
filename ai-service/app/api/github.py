from typing import Any

from fastapi import (
    APIRouter,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from app.services.github_service import (
    github_ai_service,
)


router = APIRouter(
    prefix="/github",
    tags=["GitHub AI"],
)


# =====================================================
# REQUEST MODELS
# =====================================================

class RepositoryInfo(
    BaseModel
):

    name: str = ""

    full_name: str = ""

    description: str = ""

    language: str | None = None

    stars: int = 0

    forks: int = 0

    default_branch: str = "main"


class RepositoryFile(
    BaseModel
):

    path: str

    content: str = ""


class AnalyzeRepositoryRequest(
    BaseModel
):

    project_id: str

    repository: RepositoryInfo

    tree: list[str] = Field(
        default_factory=list
    )

    files: list[
        RepositoryFile
    ] = Field(
        default_factory=list
    )


# =====================================================
# ANALYZE
# =====================================================

@router.post("/analyze")
async def analyze_repository(
    payload:
        AnalyzeRepositoryRequest
):

    try:

        result = (
            github_ai_service
            .analyze_repository(
                repository=
                    payload.repository.model_dump(),

                tree=
                    payload.tree,

                files=[
                    item.model_dump()
                    for item in payload.files
                ],
            )
        )

        return {
            "success": True,

            "project_id":
                payload.project_id,

            "analysis":
                result,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,

            detail=str(error),
        )