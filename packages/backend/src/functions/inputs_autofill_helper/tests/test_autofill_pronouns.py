from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_pronouns_radio_autofill_common_formats() -> None:
    """Test the most common pronouns radio button formats in job applications"""

    # Save pronouns using the most common format
    save_inputs = [
        create_testing_input(
            label="they/them",
            wholeQuestionLabel="What are your pronouns?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="she/her",
            wholeQuestionLabel="What are your pronouns?",
            fieldType="radio",
            value=False,
        ),
        create_testing_input(
            label="he/him",
            wholeQuestionLabel="What are your pronouns?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["identity"]["pronouns"] == "they/them"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to they/them CANONICALS
        ("they/them", True),
        ("They/Them", True),
        ("they", True),
        # Direct matches to she/her CANONICALS
        ("she/her", False),
        ("She/Her", False),
        ("she", False),
        # Direct matches to he/him CANONICALS
        ("he/him", False),
        ("He/Him", False),
        ("he", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Pronouns",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        # For they/them, it should be True; for all others in our saved state, it should be False
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_pronouns_text_autofill_variations() -> None:
    """Test text input autofill with different pronoun values"""

    # Test each pronoun option
    pronoun_test_cases = [
        ("he/him", "he/him"),
        ("she/her", "she/her"),
        ("they/them", "they/them"),
        ("ze/zir", "ze/zir"),
        ("other", "Other"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for pronoun_value, expected_text in pronoun_test_cases:
        # Save the pronoun value
        save_inputs = [
            create_testing_input(
                label=expected_text,  # Use the expected text as label for saving
                wholeQuestionLabel="Pronouns",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Pronouns",
                fieldType="text",
                wholeQuestionLabel="Please specify your pronouns",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"] == expected_text
        ), f"Failed for pronoun: {pronoun_value}"


def test_pronouns_save_critical_variations() -> None:
    """Test saving the most critical input variations found in job applications"""

    # Test key variations that should map to existing CANONICALS
    critical_cases = [
        # he/him variations
        ("he/him", "he/him"),
        ("He/Him", "he/him"),
        ("he", "he/him"),
        ("him", "he/him"),
        ("masculine", "he/him"),
        # she/her variations
        ("she/her", "she/her"),
        ("She/Her", "she/her"),
        ("she", "she/her"),
        ("her", "she/her"),
        ("feminine", "she/her"),
        # they/them variations
        ("they/them", "they/them"),
        ("They/Them", "they/them"),
        ("they", "they/them"),
        ("them", "they/them"),
        ("neutral", "they/them"),
        # ze/zir variations
        ("ze/zir", "ze/zir"),
        ("Ze/Zir", "ze/zir"),
        ("ze", "ze/zir"),
        # Other variations
        ("Other", "other"),
        ("Custom", "other"),
        # Decline variations
        ("prefer not to say", "prefer_not_to_say"),
        ("I prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in critical_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="What are your pronouns?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["identity"]["pronouns"] == expected_canonical
        ), f"Failed for input: {input_value}"


def test_pronouns_select_autofill_vectorized() -> None:
    """Test select input autofill with multiple variations at once for efficiency"""

    # Save she/her pronouns
    save_inputs = [
        create_testing_input(
            label="she/her",
            wholeQuestionLabel="Pronouns",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test multiple select variations in one call
    select_variations = [
        "Pronouns",
        "What are your pronouns?",
        "Preferred pronouns",
        "Personal pronouns",
        "Please select pronouns",
    ]

    autofill_inputs = []
    for label in select_variations:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="select",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # All should return the canonical options for she/her
    expected_options = "she/her|She/Her|she|her|She|Her|feminine|female pronouns"
    for autofill in autofills:
        assert autofill["value"] == expected_options


def test_pronouns_checkbox_edge_case() -> None:
    """Test uncommon but possible checkbox input for pronouns"""

    # Test checking a pronoun checkbox (uncommon edge case)
    save_inputs = [
        create_testing_input(
            label="he/him",
            wholeQuestionLabel="Pronoun options",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["identity"]["pronouns"] == "he/him"


def test_pronouns_text_field_edge_case() -> None:
    """Test edge case where pronouns question appears as text input"""

    # Save ze/zir pronouns first
    save_inputs = [
        create_testing_input(
            label="ze/zir",
            wholeQuestionLabel="Pronouns",
            fieldType="select",
            value="ze/zir",
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test uncommon case: text input for pronouns (usually would be select/radio)
    autofill_inputs = [
        create_testing_input(
            label="",
            fieldType="text",
            wholeQuestionLabel="What pronouns do you use?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "ze/zir"


def test_pronouns_mixed_field_types() -> None:
    """Test multiple field types with similar labels to ensure proper handling"""

    # Save he/him pronouns
    save_inputs = [
        create_testing_input(
            label="he/him",
            wholeQuestionLabel="Pronouns",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test different field types with similar pronoun-related labels
    mixed_inputs = [
        create_testing_input(
            label="Pronouns",
            fieldType="text",
        ),
        create_testing_input(
            label="Personal pronouns",
            fieldType="select",
        ),
        create_testing_input(
            label="he/him",
            fieldType="radio",
            wholeQuestionLabel="What are your pronouns?",
        ),
        create_testing_input(
            label="she/her",
            fieldType="radio",
            wholeQuestionLabel="What are your pronouns?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(mixed_inputs))

    # Text should return "he/him"
    assert autofills[0]["value"] == "he/him"
    # Select should return canonical options for he/him
    assert (
        autofills[1]["value"] == "he/him|He/Him|he|him|He|Him|masculine|male pronouns"
    )
    # he/him radio should be True (matches saved value)
    assert autofills[2]["value"] == True
    # she/her radio should be False (doesn't match saved value)
    assert autofills[3]["value"] == False
