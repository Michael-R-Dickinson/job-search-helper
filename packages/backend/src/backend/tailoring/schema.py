from pydantic import BaseModel


class Run(BaseModel):
    text: str
    styles: list[str]


class Paragraph(BaseModel):
    runs: list[Run]


class ResumeOutput(BaseModel):
    experienceSection: list[Paragraph]
    otherSection: None
