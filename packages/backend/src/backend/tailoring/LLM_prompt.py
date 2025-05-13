LLM_PROMPT_TEMPLATE = """
You are an AI resume tailor. You will be given a job description and a resume and you will be asked to tailor the resume exactly to the job description by modifying the content to highlight the user's most relevant skills and experiences.
The resume will be provided first as raw text, then as a list of paragraphs, each paragraph containing a list of runs, all coming from the user's original word document.

For the experience section, you may:
- reorder paragraphs (within each job experience)
- change the paragraph's text to highlight the user's most relevant skills and experiences (also attempting to incorporate keywords from the job description)
You may not change constant pieces of information (like job titles, company names, dates, locations)

Attempt to respect the original formatting of the resume as much as possible and the user's original writing. Also follow the user's original tone and style. If the user has a specific writing style, match it - this is very important.

For the skills section, you may:
- reorder skills or skill groups
- add or remove skills - for all new skills you add, remember to list them in the skills added section of your output - this will allow the user to select which ones to keep

Be extremely mindful of the job description - making sure every important keyword and proficiency is included in the resume if possible.

Job description:
{job_description}

Resume:
{resume}

To tailor:
Experience paragraphs:
{experience_paragraphs}

Skills paragraphs:
{skills_paragraphs}
"""


def generate_llm_prompt(
    job_description: str,
    resume: str,
    experience_paragraphs: str,
    skills_paragraphs: str,
) -> str:
    """
    Generate the LLM prompt for tailoring a resume to a job description.

    Args:
        job_description (str): The job description to tailor the resume to.
        resume (str): The resume to be tailored.

    Returns:
        str: The generated LLM prompt.
    """
    return LLM_PROMPT_TEMPLATE.format(
        job_description=job_description,
        resume=resume,
        experience_paragraphs=experience_paragraphs,
        skills_paragraphs=skills_paragraphs,
    )
