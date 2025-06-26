from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_disability_radio_autofill_common_formats() -> None:
    """Test the most common disability radio button formats in job applications"""

    # Save disability status using the most common format
    save_inputs = [
        create_testing_input(
            label="Yes, I have a disability",
            wholeQuestionLabel="Do you have a disability?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="No, I do not have a disability",
            wholeQuestionLabel="Do you have a disability?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["disability"] == "disabled"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to CANONICALS
        ("Yes", True),  # matches "disabled" canonical
        ("Yes, I have a disability", True),  # matches "disabled" canonical
        ("No", False),  # matches "enabled" canonical
        ("No, I do not have a disability", False),  # matches "enabled" canonical
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Do you have a disability?",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_disability_text_autofill_key_responses() -> None:
    """Test text input autofill with the key response formats"""

    # Set up disabled status and test text response
    save_inputs = [
        create_testing_input(
            label="Yes, I have a disability",
            wholeQuestionLabel="Do you have a disability?",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test autofilling text input
    autofill_inputs = [
        create_testing_input(
            label="",
            fieldType="text",
            wholeQuestionLabel="Please describe your disability status",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "Yes, I have a disability"


def test_disability_save_critical_variations() -> None:
    """Test saving the most critical input variations found in job applications"""

    # Test key variations that should map to existing CANONICALS
    critical_cases = [
        # Positive responses - should map to "disabled"
        ("Yes", "disabled"),
        ("Yes, I have a disability", "disabled"),
        ("I am disabled", "disabled"),
        # Negative responses - should map to "enabled"
        ("No", "enabled"),
        ("No, I do not have a disability", "enabled"),
        ("nope", "enabled"),
        # Decline responses - should map to "prefer_not_to_say"
        ("prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in critical_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="Do you have a disability?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["disability"] == expected_canonical
        ), f"Failed for input: {input_value}"


def test_disability_checkbox_basic() -> None:
    """Basic test for checkbox input (less common but still used)"""

    # Test checking a disability checkbox
    save_inputs = [
        create_testing_input(
            label="I have a disability",
            wholeQuestionLabel="Self-identification",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["disability"] == "disabled"
