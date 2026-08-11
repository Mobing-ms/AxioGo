"""
LLM provider abstraction.

Per the task instructions: "Use the model configuration already present in
the project. If Gemini is already configured, use it. Do not hardcode API
keys. Keep the LLM provider abstraction replaceable."

When GOOGLE_API_KEY is not set (e.g. local dev, CI, tests) this falls back
to a deterministic stub so AXIS remains testable and runnable without any
network access or credentials. Every agent module calls `get_llm()` from
here rather than importing langchain_google_genai directly, so swapping
providers later only touches this one file.
"""
from functools import lru_cache
from typing import Protocol

from app.config import get_settings

settings = get_settings()


class ChatModel(Protocol):
    def invoke(self, prompt: str) -> str: ...


class StubChatModel:
    """Deterministic, offline fallback used whenever no LLM API key is
    configured. Produces template-based but structurally correct output so
    the rest of the pipeline (validation, authorization, synthesis) can be
    exercised end-to-end and tested without network access."""

    def invoke(self, prompt: str) -> str:
        return (
            "[stub-llm] No GOOGLE_API_KEY configured — returning a "
            "deterministic placeholder so the pipeline can run offline. "
            f"Prompt received ({len(prompt)} chars)."
        )


class GeminiChatModel:
    """Thin wrapper around langchain_google_genai, isolated here so no other
    module needs to know which provider is in use."""

    def __init__(self, model_name: str, api_key: str):
        from langchain_google_genai import ChatGoogleGenerativeAI

        self._client = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)

    def invoke(self, prompt: str) -> str:
        result = self._client.invoke(prompt)
        return getattr(result, "content", str(result))


@lru_cache
def get_llm() -> ChatModel:
    if settings.GOOGLE_API_KEY:
        return GeminiChatModel(model_name=settings.AXIS_MODEL_NAME, api_key=settings.GOOGLE_API_KEY)
    return StubChatModel()
