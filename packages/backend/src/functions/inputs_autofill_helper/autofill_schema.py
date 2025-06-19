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


class ListModel(RootModel):
    root: list[BaseModel]

    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]

    def __len__(self):
        return len(self.root)


class InputList(ListModel):
    root: list[Input]


class ClassifiedInput(Input):
    classification: str
    classification_score: float


class ClassifiedInputList(ListModel):
    root: list[ClassifiedInput]
