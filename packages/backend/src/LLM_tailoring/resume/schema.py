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


class TailoringQuestion(BaseModel):
    question: str
    key: str


class ResumeTailoringQuestions(BaseModel):
    skills_to_add: list[TailoringQuestion]
    experience_questions: list[TailoringQuestion]

    def to_dict(self) -> dict:
        return {
            "skills_to_add": [
                {"question": q.question, "key": q.key} for q in self.skills_to_add
            ],
            "experience_questions": [
                {"question": q.question, "key": q.key}
                for q in self.experience_questions
            ],
        }


class CoverLetterSchema(BaseModel):
    content: list[SerializedParagraph]


ResumeResponseSchema = Union[ResumeTailoringQuestions, ResumeContent]


class AnsweredTailoringQuestion(BaseModel):
    question: str
    key: str
    answer: Optional[str] = None


class AnsweredResumeTailoringQuestions(BaseModel):
    skills_to_add: list[AnsweredTailoringQuestion]
    experience_questions: list[AnsweredTailoringQuestion]

    def to_dict(self) -> dict:
        return {
            "skills_to_add": [
                {"question": q.question, "key": q.key, "answer": q.answer}
                for q in self.skills_to_add
            ],
            "experience_questions": [
                {"question": q.question, "key": q.key, "answer": q.answer}
                for q in self.experience_questions
            ],
        }
