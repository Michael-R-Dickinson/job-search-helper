from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    SimpleTextOnlyCategoryHandler,
    TextOnlyCategoryHandler,
)

from dictor import dictor


class GeneralLocationHandler(TextOnlyCategoryHandler):
    def _get_values(self):
        address = dictor(self.user_autofill_data, "location.address")
        city = dictor(self.user_autofill_data, "location.city")
        state = dictor(self.user_autofill_data, "location.state")
        postal_code = dictor(self.user_autofill_data, "location.postal_code")
        country = dictor(self.user_autofill_data, "location.country")

        return {
            "address": address,
            "city": city,
            "state": state,
            "postal_code": postal_code,
            "country": country,
        }

    def can_autofill_category(self) -> bool:
        values = self._get_values()
        return values["state"] and values["city"]

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        values = self._get_values()
        if values["country"] == "usa":
            values["country"] = "united states"
        return ", ".join(
            [
                values["city"].title(),
                values["state"].title(),
                values["postal_code"],
                values["country"].title(),
            ]
        )

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        return []


class AddressHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "location/address"


class CityHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "location/city"


class StateHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "location/state"


class PostalCodeHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "location/postal_code"


class CountryHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        value = self._autofill_value
        return self.CANONICALS[value][0].title()

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "usa": ["United States", "United States of America", "USA", "US"],
            "canada": ["Canada", "CA"],
            "other": ["Other", "OTHER"],
        }

    @property
    def VALUE_PATH(self) -> str:
        return "location/country"
