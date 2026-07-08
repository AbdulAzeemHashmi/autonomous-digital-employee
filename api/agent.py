import os
from pathlib import Path
from langchain_core.prompts import ChatPromptTemplate

# Load .env from project root (works both locally and in Vercel where it's a no-op)
try:
    from dotenv import load_dotenv
    _root = Path(__file__).resolve().parent.parent
    load_dotenv(_root / ".env", override=True)
except ImportError:
    pass  # python-dotenv not installed; rely on system env vars


def run_digital_employee(user_prompt: str) -> str:
    """
    Run the AI agent on the provided user prompt.
    Tries to use Gemini if GEMINI_API_KEY is set, otherwise falls back to
    OpenAI if OPENAI_API_KEY is set, otherwise returns a mock response.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    print(f"[Agent Debug] GEMINI_API_KEY loaded: {bool(gemini_key)} (length: {len(gemini_key) if gemini_key else 0})")
    print(f"[Agent Debug] OPENAI_API_KEY loaded: {bool(openai_key)} (length: {len(openai_key) if openai_key else 0})")

    has_gemini = gemini_key and gemini_key != "mock_key"
    has_openai = openai_key and openai_key != "mock_key"

    if not has_gemini and not has_openai:
        return (
            "⚠️ No AI API key configured.\n\n"
            "To enable real AI responses, add a valid API key to your .env file:\n"
            "  • GEMINI_API_KEY=AIza... (Google Gemini)\n"
            "  • OPENAI_API_KEY=sk-... (OpenAI)\n\n"
            f"Your task was received: \"{user_prompt[:80]}{'...' if len(user_prompt) > 80 else ''}\""
        )

    # Setup the prompt
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are an expert Digital FTE Social Media Manager. "
            "Turn the user input into an engaging LinkedIn/Twitter post with relevant hashtags. "
            "Keep it professional, concise, and impactful.",
        ),
        ("user", "{input}"),
    ])

    if has_gemini:
        from langchain_google_genai import ChatGoogleGenerativeAI

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_key)
    else:
        from langchain_openai import ChatOpenAI

        llm = ChatOpenAI(model="gpt-4o-mini", api_key=openai_key)

    chain = prompt | llm
    result = chain.invoke({"input": user_prompt})
    return str(result.content)
