from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings


class ChatService:

    def __init__(self):

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
            google_api_key=settings.GEMINI_API_KEY
        )

    def generate(self, prompt: str):

        response = self.llm.invoke(prompt)

        return response.content


chat_service = ChatService()