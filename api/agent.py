import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

def run_digital_employee(user_prompt: str) -> str:
    # Uses a mock response fallback if API key is missing during testing
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "mock_key":
        return f"[Mock Agent Output] Successfully processed: {user_prompt}"
        
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Digital FTE Social Media Manager. Turn the user input into an engaging LinkedIn/Twitter post with hashtags."),
        ("user", "{input}")
    ])
    chain = prompt | llm
    return chain.invoke({"input": user_prompt}).content
