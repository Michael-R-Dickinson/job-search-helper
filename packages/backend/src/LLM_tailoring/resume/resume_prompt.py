import json
from LLM_tailoring.resume.schema import AnsweredResumeTailoringQuestions


LLM_SYSTEM_INSTRUCTIONS = """
You are an AI resume tailor. You will be given a job description and a resume and you will be asked to tailor the resume exactly to the job description by modifying the content to highlight the user's most relevant skills and experiences.
Here is your process: First, you will be given the the job description and resume. You will then reply with ResumeTailoringQuestions only, the user will answer these questions which will inform your tailoring process. Later, in another message, you will be provided with a list of paragraphs, each containing runs scraped from the original resume's word doc, as well as the user's responses to the questions. You will then use the principles and format discussed here to tailor these sections. 

## Step 1: Ask the user questions
For the skills_to_add list, each skill should just be a single word or short phrase, essentially the exact skill name that would be added to the skills section of the resume. The user will be able to select which skills to keep or remove later. These will often be specific technologies, programming languages, or methodologies. For example, "NextJS" or "Scrum". These would be things that could be directly added to the skills section of the resume. You must have no more than 5 skills in this list.

For the experience_questions list, each question should be a specific single sentence that will allow you to tailor the experience section of the resume. For example, "Did you use NextJS for your "Web Scraping Twitter" project?" or "Did your team use the Scrum methodology at Google?"
Each question should be answerable simply with a Yes or No and correspond to a specific intended change to a paragraph. You must have between 1-3 questions. Do not ask obvious questions or interest based questions where if the answer was No the user would not be applying. 

## 2: Tailor the resume - do not attempt until you have been provided with the second message containing the paragraphs and the user's answers to the questions.
You will be provided the specific paragraphs and runs from the resume's word doc and required to output a similar structure, this time with the tailored content. 

For the experience section, you may:
- reorder paragraphs (within each job experience)
- change the paragraph's text to highlight the user's most relevant skills and experiences (also attempting to incorporate keywords from the job description)
You may not change constant pieces of information (like job titles, company names, dates, locations) - and you may not reorder job experiences.

Attempt to respect the original formatting of the resume as much as possible and the user's original writing. Also follow the user's original tone and style. If the user has a specific writing style, match it - this is very important.

For the skills section, you may:
- reorder skills or skill groups
- add or remove skills - for all new skills you add, remember to list them in the skills added section of your output - this will allow the user to select which ones to keep
- make sure to include ALL skills from the job description in the skills section - we want to make sure the user passes ATS
don't go crazy with bolding and underling though

Be extremely mindful of the job description - making sure every important keyword and proficiency is included in the resume if possible.

Keep in mind, list_indent_level = 0 is an indented bullet point, and list_indent_level = 1 is the first level of sub-bullets

One element of your output, the `preserved` flag is very important. It indicates whether preserving the original formatting for this paragraph is necessary or whether it can be generically overwritten. Often things like job titles or dates are positioned or formatted differently in a way that is not displayed to you through the raw runs. These should be preserved. Things with formatting that need to be preserved are:
- titles/headers of any kind - even those that just contextualize bullet points
- company names
- job titles
- projects
- standalone dates or locations that are outside of the flow of a bullet point
pay attention to things like bold and underline, if the text is short, prefaces some bullets and is bolded/underlined, that is a very strong indicator that it should be preserved
The flag should be false for things like:
- bullet points
Be liberal in what you preserve, it is better to err on the side of preserving.
"""

LLM_QUESTIONS_PROMPT_TEMPLATE = """
## Part 1:
Job description:
{job_description}

Resume:
{resume}
"""

LLM_TAILORING_PROMPT_TEMPLATE = """
## Part 2:
Make lots of changes - user has selected a resume tailoring level 5 out of 5
This means changes to every section of the resume, and every job experience

Answers to the questions:
{question_responses}

To tailor:
Experience paragraphs:
{experience_paragraphs}

Skills paragraphs:
{skills_paragraphs}
"""


# ! Make sure to make changes across the board, using every capability given to you. Change the text, reorder the paragraphs, add bullet points, and change the indent levels of the paragraphs and add bold, underline and italic styles to the text.
# ! Use indent levels 1 AND 2 for different bullets


def generate_questions_llm_prompt(
    job_description: str,
    resume: str,
) -> str:
    """
    Generate the LLM prompt for asking questions to tailor a resume to a job description.

    Args:
        job_description (str): The job description to tailor the resume to.
        resume (str): The resume to be tailored.

    Returns:
        str: The generated LLM prompt.
    """
    return LLM_QUESTIONS_PROMPT_TEMPLATE.format(
        job_description=job_description,
        resume=resume,
    )


def _format_structured_answers(question_responses: AnsweredResumeTailoringQuestions) -> str:
    """
    Format structured QuestionAnswer objects for LLM consumption.

    For each question, shows the yes/no answer and any additional context provided.
    """
    formatted_dict = {}

    # Format skills_to_add answers
    skills_formatted = {}
    for question, answer_obj in question_responses.skills_to_add.items():
        if answer_obj.additional_info.strip():
            skills_formatted[question] = f"{'Yes' if answer_obj.answer else 'No'} - {answer_obj.additional_info.strip()}"
        else:
            skills_formatted[question] = 'Yes' if answer_obj.answer else 'No'
    formatted_dict['skills_to_add'] = skills_formatted

    # Format experience_questions answers
    experience_formatted = {}
    for question, answer_obj in question_responses.experience_questions.items():
        if answer_obj.additional_info.strip():
            experience_formatted[question] = f"{'Yes' if answer_obj.answer else 'No'} - {answer_obj.additional_info.strip()}"
        else:
            experience_formatted[question] = 'Yes' if answer_obj.answer else 'No'
    formatted_dict['experience_questions'] = experience_formatted

    return json.dumps(formatted_dict, indent=2)


def generate_tailoring_llm_prompt(
    experience_paragraphs: str,
    skills_paragraphs: str,
    question_responses: AnsweredResumeTailoringQuestions,
) -> str:
    """
    Generate the LLM prompt for tailoring a resume to a job description.

    Args:
        experience_paragraphs (str): The experience paragraphs from the resume.
        skills_paragraphs (str): The skills paragraphs from the resume.
        question_responses (AnsweredResumeTailoringQuestions): The user's responses to the questions.

    Returns:
        str: The generated LLM prompt.
    """
    # Format structured answers for LLM consumption
    formatted_responses = _format_structured_answers(question_responses)

    return LLM_TAILORING_PROMPT_TEMPLATE.format(
        experience_paragraphs=experience_paragraphs,
        skills_paragraphs=skills_paragraphs,
        question_responses=formatted_responses,
    )
