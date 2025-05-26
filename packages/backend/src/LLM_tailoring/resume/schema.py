from typing import Optional, Union
from pydantic import BaseModel


class SerializedRun(BaseModel):
    text: str
    styles: Optional[list[str]]


class SerializedParagraph(BaseModel):
    runs: list[SerializedRun]
    list_indent_level: Optional[int] = None
    preserved: Optional[bool] = False

    def get_text(self) -> str:
        return "".join(run.text for run in self.runs)


class ResumeContent(BaseModel):
    experienceSection: list[SerializedParagraph]
    skillsSection: list[SerializedParagraph]
    skillsAdded: list[str]


class ResumeTailoringQuestions(BaseModel):
    skills_to_add: list[str]
    experience_questions: list[str]

    def to_dict(self) -> dict:
        return {
            "skills_to_add": self.skills_to_add,
            "experience_questions": self.experience_questions,
        }


class CoverLetterSchema(BaseModel):
    content: list[SerializedParagraph]


ResumeResponseSchema = Union[ResumeTailoringQuestions, ResumeContent]

QuestionAnswers = dict[str, bool]


class AnsweredResumeTailoringQuestions(BaseModel):
    skills_to_add: QuestionAnswers
    experience_questions: QuestionAnswers

    def to_dict(self) -> dict:
        return {
            "skills_to_add": self.skills_to_add,
            "experience_questions": self.experience_questions,
        }
