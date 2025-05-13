from google import genai
from pydantic import BaseModel

from backend.tailoring.schema import ResumeOutput


def execute_tailoring_with_gemini():
    client = genai.Client(api_key="GOOGLE_API_KEY")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="List a few popular cookie recipes, and include the amounts of ingredients.",
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeOutput,
        },
    )

    # Use the response as a JSON string.
    print(response.text)

    # Use instantiated objects.
    # my_recipes: list[Recipe] = response.parsed
