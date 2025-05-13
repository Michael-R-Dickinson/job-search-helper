from pydantic import BaseModel


class SerializedRun(BaseModel):
    text: str
    styles: list[str]


class SerializedParagraph(BaseModel):
    runs: list[SerializedRun]

    def get_text(self) -> str:
        """
        Returns the text of the paragraph by concatenating the text of all runs.
        """
        return "".join(run.text for run in self.runs)


class ResumeOutput(BaseModel):
    experienceSection: list[SerializedParagraph]
    skillsSection: list[SerializedParagraph]
    skillsAdded: list[str]
