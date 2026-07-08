import os
from langchain_core.prompts import ChatPromptTemplate


def run_digital_employee(user_prompt: str) -> str:
    """
    Run the AI agent on the provided user prompt.
    Tries to use Gemini if GEMINI_API_KEY is set, otherwise falls back to
    OpenAI if OPENAI_API_KEY is set, otherwise returns a mock response.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    has_gemini = gemini_key and gemini_key != "mock_key"
    has_openai = openai_key and openai_key != "mock_key"

    if not has_gemini and not has_openai:
        return f"[Mock Agent Output] Successfully processed: {user_prompt}"

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
