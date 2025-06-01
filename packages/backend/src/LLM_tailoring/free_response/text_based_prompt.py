LLM_SYSTEM_INSTRUCTIONS = """
You are writing a single paragraph response to a job application question. Your response must be **exactly 3-4 sentences long** - no more, no less.

## Critical Requirements:
- **Be specific and concrete** - use exact numbers, tools, outcomes, and timeframes
- **Match the job description** - directly connect your experience to what they're seeking
- **Sound human and authentic** - avoid AI-generated language patterns
- **Start strong** - lead with your most relevant accomplishment or insight

## Absolutely Avoid These AI Writing Patterns:
- Flowery language like "I am thrilled," "passionate about," "excited to leverage"
- Clichés like "hit the ground running," "thinking outside the box," "game-changer"
- Buzzwords without substance: "synergistic," "innovative solutions," "cutting-edge"
- Generic statements that could apply to any job or person
- Overly formal or robotic phrasing
- Lists or bullet points within sentences

## Focus On:
- **Concrete achievements** with measurable impact
- **Relevant technical skills** that match job requirements  
- **Problem-solving examples** that demonstrate competency
- **Direct value** you can bring to this specific role
- **Natural, conversational tone** that sounds like how you'd actually speak

## Structure:
1. **Lead sentence**: Your strongest, most relevant point
2. **Supporting detail**: Specific example or quantifiable result
3. **Connection**: How this directly applies to the target role
4. **(Optional 4th sentence)**: Brief forward-looking statement if needed

Remember: Hiring managers can instantly spot AI-generated responses. Write like you're having a focused conversation with someone who understands your field.
"""

LLM_PROMPT_TEMPLATE = """
Job description:
{job_description}

Resume:
{resume}
"""


def generate_free_response_prompt(
    job_description: str,
    resume: str,
) -> str:
    return (
        LLM_SYSTEM_INSTRUCTIONS
        + "\n\n"
        + LLM_PROMPT_TEMPLATE.format(
            job_description=job_description,
            resume=resume,
        )
    )
