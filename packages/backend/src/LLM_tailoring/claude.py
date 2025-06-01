import os
import anthropic
from dotenv import load_dotenv

from constants import PROJECT_ID, REGION


def execute_generation_with_claude(prompt: str, model: str):
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    response = client.messages.create(
        model=model,
        messages=[
            {"role": "user", "content": prompt},
        ],
        temperature=1,
        max_tokens=1000,
    )
    return response.content[0].text


if __name__ == "__main__":
    load_dotenv()
    response = execute_generation_with_claude(
        prompt="Hello whats your name?", model="claude-sonnet-4-20250514"
    )
    print(response)
