from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_gender_identity_radio_autofill_common_formats() -> None:
    """Test the most common gender identity radio button formats in job applications"""

    # Save gender identity using the most common format
    save_inputs = [
        create_testing_input(
            label="Woman",
            wholeQuestionLabel="What is your gender identity?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="Man",
            wholeQuestionLabel="What is your gender identity?",
            fieldType="radio",
            value=False,
        ),
        create_testing_input(
            label="Non-binary",
            wholeQuestionLabel="What is your gender identity?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["identity"]["gender"] == "woman"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to woman CANONICALS
        ("Female", True),
        ("Woman", True),
        ("F", True),
        # Direct matches to man CANONICALS
        ("Male", False),
        ("Man", False),
        ("M", False),
        # Direct matches to non_binary CANONICALS
        ("Non-binary", False),
        ("Nonbinary", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Gender identity",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        # For woman, it should be True; for all others in our saved state, it should be False
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_gender_identity_text_autofill_variations() -> None:
    """Test text input autofill with different gender identity values"""

    # Test each gender identity option
    gender_test_cases = [
        ("man", "Man"),
        ("woman", "Woman"),
        ("non_binary", "Non-binary"),
        ("other", "Other"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for gender_value, expected_text in gender_test_cases:
        # Save the gender identity value
        save_inputs = [
            create_testing_input(
                label=expected_text,  # Use the expected text as label for saving
                wholeQuestionLabel="Gender identity",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Gender",
                fieldType="text",
                wholeQuestionLabel="Please specify your gender identity",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"] == expected_text
        ), f"Failed for gender: {gender_value}"


def test_gender_identity_save_critical_variations() -> None:
    """Test saving the most critical input variations found in job applications"""

    # Test key variations that should map to existing CANONICALS
    critical_cases = [
        # Man variations
        ("Male", "man"),
        ("Man", "man"),
        ("M", "man"),
        ("male", "man"),
        # Woman variations
        ("Female", "woman"),
        ("Woman", "woman"),
        ("F", "woman"),
        ("female", "woman"),
        # Non-binary variations
        ("Non-binary", "non_binary"),
        ("Nonbinary", "non_binary"),
        ("Non binary", "non_binary"),
        ("Gender neutral", "non_binary"),
        ("Genderqueer", "non_binary"),
        # Other variations
        ("Other", "other"),
        ("Self-describe", "other"),
        # Decline variations
        ("prefer not to say", "prefer_not_to_say"),
        ("I prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in critical_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="What is your gender identity?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["identity"]["gender"] == expected_canonical
        ), f"Failed for input: {input_value}"


def test_gender_identity_select_autofill_vectorized() -> None:
    """Test select input autofill with multiple variations at once for efficiency"""

    # Save non-binary gender identity
    save_inputs = [
        create_testing_input(
            label="Non-binary",
            wholeQuestionLabel="Gender identity",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test multiple select variations in one call
    select_variations = [
        "Gender identity",
        "What is your gender?",
        "Please select your gender",
        "Gender",
        "Sex/Gender",
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

    # All should return the canonical options for non_binary
    expected_options = (
        "Non-binary|Nonbinary|Non binary|Enby|Gender neutral|Genderqueer|Neither"
    )
    for autofill in autofills:
        assert autofill["value"] == expected_options


def test_gender_identity_checkbox_edge_case() -> None:
    """Test uncommon but possible checkbox input for gender identity"""

    # Test checking a gender identity checkbox (uncommon edge case)
    save_inputs = [
        create_testing_input(
            label="Non-binary",
            wholeQuestionLabel="Gender identity",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["identity"]["gender"] == "non_binary"


def test_gender_identity_text_field_edge_case() -> None:
    """Test edge case where gender identity question appears as text input"""

    # Save "other" gender identity first
    save_inputs = [
        create_testing_input(
            label="Other",
            wholeQuestionLabel="Gender identity",
            fieldType="select",
            value="Other",
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test uncommon case: text input for gender (usually would be select/radio)
    autofill_inputs = [
        create_testing_input(
            label="",
            fieldType="text",
            wholeQuestionLabel="What is your gender identity?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "Other"


def test_gender_identity_mixed_field_types() -> None:
    """Test multiple field types with similar labels to ensure proper handling"""

    # Save man gender identity
    save_inputs = [
        create_testing_input(
            label="Male",
            wholeQuestionLabel="Gender",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test different field types with similar gender-related labels
    mixed_inputs = [
        create_testing_input(
            label="Gender identity",
            fieldType="text",
        ),
        create_testing_input(
            label="Gender",
            fieldType="select",
        ),
        create_testing_input(
            label="Male",
            fieldType="radio",
            wholeQuestionLabel="What is your gender?",
        ),
        create_testing_input(
            label="Female",
            fieldType="radio",
            wholeQuestionLabel="What is your gender?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(mixed_inputs))

    # Text should return "Man"
    assert autofills[0]["value"] == "Man"
    # Select should return canonical options for man
    assert autofills[1]["value"] == "Male|Man|M|male|man"
    # Male radio should be True (matches saved value)
    assert autofills[2]["value"] == True
    # Female radio should be False (doesn't match saved value)
    assert autofills[3]["value"] == False
