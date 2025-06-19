from typing import Optional
from pydantic import BaseModel, RootModel


class Input(BaseModel):
    label: str
    fieldType: str
    name: Optional[str] = None
    wholeQuestionLabel: Optional[str] = None
    value: Optional[str] = None
    id: str

    def with_classification(self, classification: str, score: float):
        data = self.model_dump()
        data["classification"] = classification
        data["classification_score"] = score
        return ClassifiedInput.model_validate(data)


class InputList(RootModel):
    root: list[Input]

    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]


class ClassifiedInput(Input):
    classification: str
    classification_score: float


class ClassifiedInputList(RootModel):
    root: list[ClassifiedInput]

    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]
