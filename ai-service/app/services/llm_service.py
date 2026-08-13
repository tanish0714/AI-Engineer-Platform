from app.core.gemini import llm


class LLMService:

    async def generate_response(self, prompt: str):

        response = await llm.ainvoke(prompt)

        return response.content


llm_service = LLMService()