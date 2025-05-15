from typing import Optional
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


class ResumeOutput(BaseModel):
    experienceSection: list[SerializedParagraph]
    skillsSection: list[SerializedParagraph]
    skillsAdded: list[str]
