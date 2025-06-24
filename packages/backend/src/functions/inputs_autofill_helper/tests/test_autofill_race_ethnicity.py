from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_race_ethnicity_radio_autofill_common_formats() -> None:
    """Test the most common race/ethnicity radio button formats in job applications"""

    # Save Asian race using a common format
    save_inputs = [
        create_testing_input(
            label="Asian",
            wholeQuestionLabel="What is your race or ethnicity?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="Black or African American",
            wholeQuestionLabel="What is your race or ethnicity?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "asian"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Asian variations
        ("Asian", True),
        ("Asian American", True),
        ("Chinese", True),
        ("Korean", True),
        ("South Asian", True),
        # Other races (should be False since we saved "asian")
        ("White", False),
        ("Black", False),
        ("Hispanic", False),
        ("Native American", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Please select your race or ethnicity",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_race_ethnicity_vectorized_radio_autofill() -> None:
    """Test multiple race/ethnicity radio inputs at once for efficiency"""

    # Save Black/African American race
    save_inputs = [
        create_testing_input(
            label="Black or African American",
            wholeQuestionLabel="Race/Ethnicity",
            fieldType="radio",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "black"

    # Test multiple variations in a single request
    radio_test_cases = {
        "African American": True,
        "Black": True,
        "Caribbean": True,
        "Nigerian": True,
        "White": False,
        "Caucasian": False,
        "Asian": False,
        "Hispanic": False,
        "Native American": False,
        "Pacific Islander": False,
    }

    autofill_inputs = []
    for label in radio_test_cases.keys():
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Select your race",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill, expected_value in zip(autofills, radio_test_cases.values()):
        assert (
            autofill["value"] == expected_value
        ), f"Failed for label: {autofill['label']}"


def test_race_ethnicity_text_input_variations() -> None:
    """Test text input autofill with different race/ethnicity values"""

    race_test_cases = [
        ("white", "White"),
        ("native_american", "American Indian or Alaska Native"),
        ("pacific_islander", "Native Hawaiian or Other Pacific Islander"),
        ("two_or_more", "Two or more races"),
        ("other", "Other"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for race_value, expected_text in race_test_cases:
        # Save the race value
        save_inputs = [
            create_testing_input(
                label=expected_text,
                wholeQuestionLabel="Race/Ethnicity",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Race/Ethnicity",
                fieldType="text",
                wholeQuestionLabel="Please specify your race or ethnicity",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert autofills[0]["value"] == expected_text, f"Failed for race: {race_value}"


def test_race_ethnicity_select_dropdown_variations() -> None:
    """Test select dropdown autofill with comprehensive race/ethnicity options"""

    # Save Hispanic/Latino race
    save_inputs = [
        create_testing_input(
            label="Hispanic or Latino",
            fieldType="select",
            value="Hispanic or Latino",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "hispanic"

    # Test select dropdown with pipe-separated options
    autofill_inputs = [
        create_testing_input(
            label="Race/Ethnicity Selection",
            fieldType="select",
            wholeQuestionLabel="Please select your race or ethnicity",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    # Should return pipe-separated canonicals for frontend processing
    expected_options = "|".join(
        [
            "Hispanic",
            "Hispanic or Latino",
            "Latino",
            "Latina",
            "Latinx",
            "Latin",
            "Spanish",
            "Mexican",
            "Mexican American",
            "Chicano",
            "Puerto Rican",
            "Cuban",
            "Dominican",
            "Salvadoran",
            "Guatemalan",
            "Honduran",
            "Nicaraguan",
            "Costa Rican",
            "Panamanian",
            "Colombian",
            "Venezuelan",
            "Peruvian",
            "Ecuadorian",
            "Bolivian",
            "Chilean",
            "Argentinian",
            "Uruguayan",
            "Paraguayan",
            "Brazilian",
            "Spanish American",
            "Central American",
            "South American",
            "Hispanic - Mexican",
            "Hispanic - Puerto Rican",
            "Hispanic - Cuban",
            "Hispanic - Other",
            "H",
        ]
    )
    assert autofills[0]["value"] == expected_options


def test_race_ethnicity_comprehensive_canonical_matching() -> None:
    """Test comprehensive canonical matching for each race/ethnicity category"""

    # Test Native American variations
    save_inputs = [
        create_testing_input(
            label="American Indian or Alaska Native",
            fieldType="select",
            value="American Indian or Alaska Native",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "native_american"

    # Test various Native American synonyms
    native_american_cases = {
        "Native American": True,
        "American Indian": True,
        "Indigenous": True,
        "Cherokee": True,
        "Navajo": True,
        "First Nations": True,
        "Aboriginal": True,
        "Inuit": True,
        "AI/AN": True,
    }

    autofill_inputs = []
    for label in native_american_cases.keys():
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Native American Identity",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill, expected_value in zip(autofills, native_american_cases.values()):
        assert (
            autofill["value"] == expected_value
        ), f"Failed for Native American label: {autofill['label']}"


def test_race_ethnicity_multiracial_and_special_cases() -> None:
    """Test multiracial and special race/ethnicity cases"""

    # Test Two or More Races
    save_inputs = [
        create_testing_input(
            label="Two or more races",
            fieldType="select",
            value="Two or more races",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "two_or_more"

    # Test multiracial variations
    multiracial_cases = {
        "Multiracial": True,
        "Multi-racial": True,
        "Mixed race": True,
        "Biracial": True,
        "Multiple races": True,
        "Mixed heritage": True,
        "TM": True,  # Abbreviation
        "Asian": False,  # Single race should be False
        "White": False,
    }

    autofill_inputs = []
    for label in multiracial_cases.keys():
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Multiracial Identity",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill, expected_value in zip(autofills, multiracial_cases.values()):
        assert (
            autofill["value"] == expected_value
        ), f"Failed for multiracial label: {autofill['label']}"


def test_race_ethnicity_save_critical_variations() -> None:
    """Test saving different race/ethnicity input formats"""

    # Test saving various formats and ensuring correct canonical values
    save_test_cases = [
        ("Vietnamese", "asian"),
        ("Filipino", "asian"),
        ("Caucasian", "white"),
        ("European American", "white"),
        ("African", "black"),
        ("Jamaican", "black"),
        ("Mexican American", "hispanic"),
        ("Puerto Rican", "hispanic"),
        ("Samoan", "pacific_islander"),
        ("Hawaiian", "pacific_islander"),
        ("Cherokee", "native_american"),
        ("Alaska Native", "native_american"),
        ("Mixed", "two_or_more"),
        ("Biracial", "two_or_more"),
        ("Some other race", "other"),
        ("Not listed", "other"),
    ]

    for input_label, expected_canonical in save_test_cases:
        save_inputs = [
            create_testing_input(
                label=input_label,
                fieldType="select",
                value=input_label,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )
        assert (
            updated_autofill_data["race"]["race"] == expected_canonical
        ), f"Failed save for {input_label}, expected {expected_canonical}"


def test_race_ethnicity_edge_cases() -> None:
    """Test edge cases and uncommon field types for race/ethnicity"""

    # Save Pacific Islander status
    save_inputs = [
        create_testing_input(
            label="Native Hawaiian or Other Pacific Islander",
            fieldType="radio",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "pacific_islander"

    # Test checkbox input type (uncommon for race/ethnicity)
    checkbox_inputs = [
        create_testing_input(
            label="Pacific Islander",
            fieldType="checkbox",
            wholeQuestionLabel="Select all that apply to your race/ethnicity",
        ),
        create_testing_input(
            label="Native Hawaiian",
            fieldType="checkbox",
            wholeQuestionLabel="Select all that apply to your race/ethnicity",
        ),
        create_testing_input(
            label="Samoan",
            fieldType="checkbox",
            wholeQuestionLabel="Select all that apply to your race/ethnicity",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(checkbox_inputs))
    # All Pacific Islander variations should be True
    for autofill in autofills:
        assert autofill["value"] == True, f"Failed checkbox for: {autofill['label']}"

    # Test text input for race (uncommon but possible)
    text_input = [
        create_testing_input(
            label="Please specify your race or ethnicity",
            fieldType="text",
        ),
    ]

    text_autofills = get_filled_inputs(get_testing_user(), InputList(text_input))
    assert text_autofills[0]["value"] == "Native Hawaiian or Other Pacific Islander"


def test_race_ethnicity_decline_to_answer() -> None:
    """Test 'prefer not to say' functionality for race/ethnicity"""

    # Save prefer not to say
    save_inputs = [
        create_testing_input(
            label="I prefer not to say",
            fieldType="select",
            value="I prefer not to say",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["race"] == "prefer_not_to_say"

    # Test various decline variations
    decline_cases = {
        "Prefer not to say": True,
        "I would rather not say": True,
        "Choose not to specify": True,
        "Asian": False,  # Specific race should be False
        "Other": False,
    }

    autofill_inputs = []
    for label in decline_cases.keys():
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Race/Ethnicity (Optional)",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill, expected_value in zip(autofills, decline_cases.values()):
        assert (
            autofill["value"] == expected_value
        ), f"Failed for decline label: {autofill['label']}"
