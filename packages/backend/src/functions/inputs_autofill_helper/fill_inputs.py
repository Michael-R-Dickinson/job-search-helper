import json
from firebase import init_firebase
from firebase.realtime_db import get_user_autofill_data
from functions.inputs_autofill_helper.gemini_generation import (
    AutofillResponseSchema,
    generate_autofill_with_gemini,
)
from functions.inputs_autofill_helper.parse_template_to_instructions import (
    map_autofill_template_to_instructions,
)

# autofill_values_temp = {
#     "autofill_instructions": [
#         {
#             "input_id": "af-c0cf7028-3dfe-4cca-8987-47821c4b8603",
#             "valuePathString": "{name/first_name}-{name/last_name}",
#             "initialLabel": "first name",
#         },
#         {
#             "input_id": "af-67406170-06aa-4f9f-b931-608a2f15d658",
#             "valuePathString": "{name/last_name}",
#             "initialLabel": "last name",
#         },
#         {
#             "input_id": "af-839c78be-9b11-4b70-aace-d764574695b9",
#             "valuePathString": "{pronouns}",
#             "initialLabel": "pronouns",
#         },
#         {
#             "input_id": "af-052852e8-5a73-4cc8-adf4-097e906800f3",
#             "valuePathString": "{email}",
#             "initialLabel": "email",
#         },
#         {
#             "input_id": "af-a392c59e-7923-4e5f-b270-f4b947d9a298",
#             "valuePathString": "{location/address}",
#             "initialLabel": "address",
#         },
#         {
#             "input_id": "af-dc3a13c0-d3fd-4d11-9b5a-b8c4b1496ea4",
#             "valuePathString": "{location/city}",
#             "initialLabel": "city",
#         },
#         {
#             "input_id": "af-274a450c-d5d8-416e-a633-f156022d9996",
#             "valuePathString": "{location/country}",
#             "initialLabel": "country",
#         },
#         {
#             "input_id": "af-84e2fee0-74d7-4937-8567-a04b0d79b7fd",
#             "valuePathString": "{location/postal_code}",
#             "initialLabel": "zip/postal code",
#         },
#         {
#             "input_id": "af-54f0e31d-575b-4b19-bdac-53ee3fc9165b",
#             "valuePathString": "{phone/phoneNum}",
#             "initialLabel": "cell phone",
#         },
#         {
#             "input_id": "af-0ca0c225-52ba-4425-a2f8-f5d4f4eb9604",
#             "valuePathString": "{phone/phoneNum}",
#             "initialLabel": "phone",
#         },
#         {
#             "input_id": "af-b53b3371-6b0b-4ed3-9489-c3f17ab43c37",
#             "valuePathString": "{current_company}",
#             "initialLabel": "current employer",
#         },
#         {
#             "input_id": "af-60d82b49-63d7-4bf3-a0b8-0cfb3f09963d",
#             "valuePathString": "{current_job_title}",
#             "initialLabel": "current title",
#         },
#         {
#             "input_id": "af-27d8a0ea-b91a-4741-af70-7c77f4232bc6",
#             "valuePathString": "{salary_expectations}",
#             "initialLabel": "what are your salary expectations for this role?",
#         },
#         {
#             "input_id": "af-b521d68e-dbc9-40dd-9137-d40248796b21",
#             "valuePathString": {
#                 "condition": {"valuePathString": "{authorization}", "value": "yes"},
#                 "truthyValuePathString": "yes",
#                 "falsyValuePathString": "no",
#             },
#             "initialLabel": "yes",
#         },
#         {
#             "input_id": "af-3ce20633-63d0-4519-8807-d8f8f2bc5b2b",
#             "valuePathString": {
#                 "condition": {"valuePathString": "{authorization}", "value": "yes"},
#                 "truthyValuePathString": "yes",
#                 "falsyValuePathString": "no",
#             },
#             "initialLabel": "no",
#         },
#         {
#             "input_id": "af-7e9e1ba8-52d7-42a4-8634-0926358c3aa2",
#             "valuePathString": {
#                 "condition": {
#                     "valuePathString": "{sponsorship/yesNoAnswer}",
#                     "value": "true",
#                 },
#                 "truthyValuePathString": "yes",
#                 "falsyValuePathString": "no",
#             },
#             "initialLabel": "yes",
#         },
#         {
#             "input_id": "af-b4c058c9-aabc-47a0-89aa-fbd59be57c56",
#             "valuePathString": {
#                 "condition": {
#                     "valuePathString": "{sponsorship/yesNoAnswer}",
#                     "value": "true",
#                 },
#                 "truthyValuePathString": "yes",
#                 "falsyValuePathString": "no",
#             },
#             "initialLabel": "no",
#         },
#     ]
# }


def get_filled_inputs(user_id, inputs):
    user_autofill_data = get_user_autofill_data(user_id)
    if not user_autofill_data:
        raise ValueError("User data not found")

    # autofill_template_values = AutofillResponseSchema(**autofill_values_temp)
    autofill_template_values = generate_autofill_with_gemini(inputs)
    # print(json.dumps(autofill_template_values.model_dump(), indent=2))
    autofill_instructions = map_autofill_template_to_instructions(
        autofill_template_values, user_autofill_data
    )

    return autofill_instructions


if __name__ == "__main__":
    init_firebase()
    get_filled_inputs("J6hCwOP0KeYUpCRPLOebTIWLA392", {})
