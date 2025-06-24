from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_sexual_orientation_radio_autofill_common_formats() -> None:
    """Test the most common sexual orientation radio button formats in job applications"""

    # Save sexual orientation using the most common format
    save_inputs = [
        create_testing_input(
            label="Pansexual",
            wholeQuestionLabel="What is your sexual orientation?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="Heterosexual",
            wholeQuestionLabel="What is your sexual orientation?",
            fieldType="radio",
            value=False,
        ),
        create_testing_input(
            label="Homosexual",
            wholeQuestionLabel="What is your sexual orientation?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["identity"]["sexual_orientation"] == "pansexual"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to pansexual CANONICALS
        ("Pansexual", True),
        ("pansexual", True),
        ("Pan", True),
        # Direct matches to heterosexual CANONICALS
        ("Heterosexual", False),
        ("Straight", False),
        ("straight", False),
        # Direct matches to homosexual CANONICALS
        ("Homosexual", False),
        ("Gay", False),
        ("Lesbian", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Sexual orientation",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        # For pansexual, it should be True; for all others in our saved state, it should be False
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_sexual_orientation_text_autofill_variations() -> None:
    """Test text input autofill with different sexual orientation values"""

    # Test each sexual orientation option
    orientation_test_cases = [
        ("heterosexual", "Heterosexual"),
        ("homosexual", "Homosexual"),
        ("pansexual", "Pansexual"),
        ("asexual", "Asexual"),
        ("queer", "Queer"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for orientation_value, expected_text in orientation_test_cases:
        # Save the sexual orientation value
        save_inputs = [
            create_testing_input(
                label=expected_text,  # Use the expected text as label for saving
                wholeQuestionLabel="Sexual orientation",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Sexual orientation",
                fieldType="text",
                wholeQuestionLabel="Please specify your sexual orientation",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"] == expected_text
        ), f"Failed for orientation: {orientation_value}"


def test_sexual_orientation_save_critical_variations() -> None:
    """Test saving the most critical input variations found in job applications"""

    # Test key variations that should map to existing CANONICALS
    critical_cases = [
        # Heterosexual variations
        ("Heterosexual", "heterosexual"),
        ("heterosexual", "heterosexual"),
        ("Straight", "heterosexual"),
        ("straight", "heterosexual"),
        ("Hetero", "heterosexual"),
        # Homosexual variations
        ("Homosexual", "homosexual"),
        ("homosexual", "homosexual"),
        ("Gay", "homosexual"),
        ("gay", "homosexual"),
        ("Lesbian", "homosexual"),
        ("lesbian", "homosexual"),
        # Pansexual variations
        ("Pansexual", "pansexual"),
        ("pansexual", "pansexual"),
        ("Pan", "pansexual"),
        ("pan", "pansexual"),
        ("Omnisexual", "pansexual"),
        # Asexual variations
        ("Asexual", "asexual"),
        ("asexual", "asexual"),
        ("Ace", "asexual"),
        ("ace", "asexual"),
        # Queer variations
        ("Queer", "queer"),
        ("queer", "queer"),
        ("LGBTQ+", "queer"),
        ("LGBT", "queer"),
        ("Questioning", "queer"),
        # Decline variations
        ("prefer not to say", "prefer_not_to_say"),
        ("I prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in critical_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="What is your sexual orientation?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["identity"]["sexual_orientation"]
            == expected_canonical
        ), f"Failed for input: {input_value}"


def test_sexual_orientation_select_autofill_vectorized() -> None:
    """Test select input autofill with multiple variations at once for efficiency"""

    # Save queer sexual orientation
    save_inputs = [
        create_testing_input(
            label="Queer",
            wholeQuestionLabel="Sexual orientation",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test multiple select variations in one call
    select_variations = [
        "Sexual orientation",
        "What is your sexual orientation?",
        "Sexual identity",
        "Please select orientation",
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

    # All should return the canonical options for queer
    expected_options = "Queer|queer|LGBTQ+|LGBT|Questioning|questioning"
    for autofill in autofills:
        assert autofill["value"] == expected_options


def test_sexual_orientation_checkbox_edge_case() -> None:
    """Test uncommon but possible checkbox input for sexual orientation"""

    # Test checking a sexual orientation checkbox (uncommon edge case)
    save_inputs = [
        create_testing_input(
            label="Asexual",
            wholeQuestionLabel="Sexual orientation options",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["identity"]["sexual_orientation"] == "asexual"


def test_sexual_orientation_text_field_edge_case() -> None:
    """Test edge case where sexual orientation question appears as text input"""

    # Save heterosexual orientation first
    save_inputs = [
        create_testing_input(
            label="Straight",
            wholeQuestionLabel="Sexual orientation",
            fieldType="select",
            value="Straight",
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test uncommon case: text input for sexual orientation (usually would be select/radio)
    autofill_inputs = [
        create_testing_input(
            label="",
            fieldType="text",
            wholeQuestionLabel="What is your sexual orientation?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "Heterosexual"


def test_sexual_orientation_mixed_field_types() -> None:
    """Test multiple field types with similar labels to ensure proper handling"""

    # Save homosexual orientation
    save_inputs = [
        create_testing_input(
            label="Gay",
            wholeQuestionLabel="Sexual orientation",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test different field types with similar orientation-related labels
    mixed_inputs = [
        create_testing_input(
            label="Sexual orientation",
            fieldType="text",
        ),
        create_testing_input(
            label="Sexual identity",
            fieldType="select",
        ),
        create_testing_input(
            label="Gay",
            fieldType="radio",
            wholeQuestionLabel="What is your sexual orientation?",
        ),
        create_testing_input(
            label="Straight",
            fieldType="radio",
            wholeQuestionLabel="What is your sexual orientation?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(mixed_inputs))

    # Text should return "Homosexual"
    assert autofills[0]["value"] == "Homosexual"
    # Select should return canonical options for homosexual
    assert autofills[1]["value"] == "Homosexual|homosexual|Gay|gay|Lesbian|lesbian"
    # Gay radio should be True (matches saved value)
    assert autofills[2]["value"] == True
    # Straight radio should be False (doesn't match saved value)
    assert autofills[3]["value"] == False
