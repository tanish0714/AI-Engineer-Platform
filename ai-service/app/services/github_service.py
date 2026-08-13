import json

from google import genai

from app.core.config import settings


class GitHubAIService:

    def __init__(self):
        # IMPORTANT:
        # Do NOT use os.getenv() here.
        # Pydantic Settings already loads .env.
        api_key = settings.GEMINI_API_KEY

        if not api_key or not api_key.strip():
            raise RuntimeError(
                "GEMINI_API_KEY is not configured"
            )

        self.client = genai.Client(
            api_key=api_key.strip()
        )

        self.model = getattr(
            settings,
            "GEMINI_MODEL",
            "gemini-2.5-flash",
        )

    # =================================================
    # ANALYZE REPOSITORY
    # =================================================

    def analyze_repository(
        self,
        repository,
        tree,
        files,
    ):
        # ---------------------------------------------
        # SAFE INPUTS
        # ---------------------------------------------

        repository = repository or {}
        tree = tree or []
        files = files or []

        # ---------------------------------------------
        # FILE TREE
        # ---------------------------------------------

        tree_text = "\n".join(
            str(path)
            for path in tree[:100]
        )

        # ---------------------------------------------
        # FILE CONTENTS
        # ---------------------------------------------

        file_sections = []

        for item in files[:40]:

            if not isinstance(item, dict):
                continue

            path = item.get(
                "path",
                "",
            )

            content = item.get(
                "content",
                "",
            )

            if not path:
                continue

            if not isinstance(content, str):
                content = str(content)

            file_sections.append(
                f"\n\n===== FILE: {path} =====\n"
                f"{content[:30000]}"
            )

        file_text = "".join(
            file_sections
        )

        # ---------------------------------------------
        # PROMPT
        # ---------------------------------------------

        prompt = f"""
You are a senior software architect and code reviewer.

Analyze the GitHub repository below.

IMPORTANT RULES:

- Do not invent technologies that are not visible in the repository.
- Base your analysis only on the supplied repository metadata,
  file tree and file contents.
- Be practical and technically accurate.
- Identify what the project actually does.
- Mention uncertainty when evidence is insufficient.
- Do not assume a framework merely from a filename.
- Do not claim a database, API, library, or architecture
  unless there is evidence in the supplied data.
- Keep the response concise but useful.
- Return ONLY valid JSON.
- Do not return markdown.
- Do not wrap the JSON inside ```json fences.

REPOSITORY:

Name:
{repository.get("name", "")}

Full name:
{repository.get("full_name", "")}

Description:
{repository.get("description", "")}

Primary language:
{repository.get("language") or "Unknown"}

Stars:
{repository.get("stars", 0)}

Forks:
{repository.get("forks", 0)}

Default branch:
{repository.get("default_branch", "main")}


FILE TREE:

{tree_text}


IMPORTANT FILE CONTENTS:

{file_text}


Return ONLY valid JSON.

Required JSON structure:

{{
    "overview": "",

    "techStack": [],

    "architecture": {{
        "type": "",
        "frontend": [],
        "backend": [],
        "database": [],
        "apis": [],
        "other": []
    }},

    "keyFeatures": [],

    "importantFiles": [
        {{
            "path": "",
            "purpose": ""
        }}
    ],

    "codeQuality": {{
        "score": 0,
        "strengths": [],
        "issues": []
    }},

    "security": {{
        "score": 0,
        "strengths": [],
        "issues": []
    }},

    "scalability": {{
        "score": 0,
        "strengths": [],
        "issues": []
    }},

    "aiOpportunities": [],

    "recommendations": [],

    "interviewTopics": [],

    "summary": ""
}}

Rules for scores:

- score must be an integer from 0 to 100.
- Keep arrays concise.
- Do not include markdown.
- Return valid JSON only.
"""

        # ---------------------------------------------
        # GEMINI REQUEST
        # ---------------------------------------------

        try:

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "temperature": 0.2,
                    "response_mime_type": "application/json",
                },
            )

        except Exception as error:

            raise RuntimeError(
                f"Gemini repository analysis failed: {error}"
            ) from error

        # ---------------------------------------------
        # RESPONSE TEXT
        # ---------------------------------------------

        raw = (
            response.text.strip()
            if response and response.text
            else ""
        )

        if not raw:
            raise RuntimeError(
                "Gemini returned an empty response"
            )

        # ---------------------------------------------
        # PARSE JSON
        # ---------------------------------------------

        try:

            return json.loads(raw)

        except json.JSONDecodeError:

            # -----------------------------------------
            # FALLBACK:
            # Remove accidental markdown fences
            # -----------------------------------------

            cleaned = raw.strip()

            if cleaned.startswith(
                "```json"
            ):
                cleaned = cleaned[
                    len("```json"):
                ]

            elif cleaned.startswith(
                "```"
            ):
                cleaned = cleaned[
                    len("```"):
                ]

            if cleaned.endswith(
                "```"
            ):
                cleaned = cleaned[
                    :-len("```")
                ]

            cleaned = cleaned.strip()

            try:

                return json.loads(
                    cleaned
                )

            except json.JSONDecodeError as error:

                raise RuntimeError(
                    "Gemini returned invalid JSON"
                ) from error


# =====================================================
# SINGLE SERVICE INSTANCE
# =====================================================

github_ai_service = GitHubAIService()