from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_sponsorship_radio_autofill_common_formats() -> None:
    """Test the most common sponsorship radio button formats in job applications"""

    # Save sponsorship status using common format - person requires sponsorship
    save_inputs = [
        create_testing_input(
            label="Yes",
            wholeQuestionLabel="Will you now or in the future require immigration sponsorship for employment?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="No",
            wholeQuestionLabel="Will you now or in the future require immigration sponsorship for employment?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["sponsorship"]["yesNoAnswer"] == "require_sponsorship"

    # Test autofilling with critical variations of sponsorship questions
    test_cases = [
        # Basic Yes/No variations
        ("Yes", True),
        ("No", False),
        # More specific responses
        ("Yes, I require sponsorship", True),
        ("No, I do not require sponsorship", False),
        # Present tense variations
        ("Yes, I need sponsorship", True),
        ("No, I am authorized to work", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Do you now, or will you in the future, require sponsorship for employment visa status?",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_sponsorship_various_question_formats() -> None:
    """Test different ways companies ask about sponsorship"""

    # Test the Tesla-style question format
    tesla_inputs = [
        create_testing_input(
            label="Yes",
            wholeQuestionLabel="Will you now or in the future require immigration sponsorship for employment with Tesla?",
            fieldType="radio",
            value=True,
        ),
    ]

    save_input_values(get_testing_user(), InputList(tesla_inputs))

    # Test H-1B specific question format
    h1b_inputs = [
        create_testing_input(
            label="Yes",
            fieldType="radio",
            wholeQuestionLabel="Do you now, or will you in the future, require sponsorship for employment visa status (e.g., H-1B visa status) to work legally for Company in United States of America?",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(h1b_inputs))
    assert autofills[0]["value"] == True

    # Test simplified version
    simple_inputs = [
        create_testing_input(
            label="No",
            fieldType="radio",
            wholeQuestionLabel="Will you now or in the future require sponsorship for employment visa status?",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(simple_inputs))
    assert autofills[0]["value"] == False  # Should match label "No"


def test_sponsorship_text_input_responses() -> None:
    """Test text input responses for sponsorship questions"""

    # Set up user who requires sponsorship
    save_inputs = [
        create_testing_input(
            label="Will you require sponsorship?",
            fieldType="select",
            value="yes, I will",
        ),
        create_testing_input(
            label="Will you require sponsorship? If so explain",
            fieldType="text",
            value="I will because i'm a student fr fr",
        ),
    ]
    saves = save_input_values(get_testing_user(), InputList(save_inputs))

    # Test text input asking for sponsorship status
    text_inputs = [
        create_testing_input(
            label="Please explain your sponsorship status",
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(text_inputs))
    # This gets classified as sponsorship_explanation, so it uses textAnswer if available
    assert autofills[0]["value"] == "I will because i'm a student fr fr"

    # Test text input asking for sponsorship yes/no with clear sponsorship wording
    yesno_text_inputs = [
        create_testing_input(
            label="Do you require sponsorship",
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(yesno_text_inputs))
    assert autofills[0]["value"] == "Yes, I require sponsorship to work"


def test_sponsorship_save_critical_variations() -> None:
    """Test saving various sponsorship response formats to ensure proper classification"""

    # Test positive responses that should map to requires_sponsorship: true
    positive_cases = [
        "Yes",
        "Yes, I require sponsorship",
        "I need sponsorship",
        "I require visa sponsorship",
        "Yes, I will need sponsorship",
    ]

    for input_value in positive_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="Will you require sponsorship?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["sponsorship"]["yesNoAnswer"] == "require_sponsorship"
        ), f"Failed for positive input: {input_value}"

        # Test negative responses that should map to no_sponsorship
    negative_cases = [
        "No",
        "No, I do not require sponsorship",
        "No sponsorship needed",
    ]

    for input_value in negative_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="Do you require sponsorship?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["sponsorship"]["yesNoAnswer"] == "no_sponsorship"
        ), f"Failed for negative input: {input_value}"


def test_sponsorship_checkbox_format() -> None:
    """Test checkbox format for sponsorship questions"""

    # Test checking sponsorship checkbox
    save_inputs = [
        create_testing_input(
            label="I will require sponsorship for employment",
            wholeQuestionLabel="Employment Authorization",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["sponsorship"]["yesNoAnswer"] == "require_sponsorship"

    # Test autofilling different checkbox variations that will be classified as sponsorship_required
    autofill_inputs = [
        create_testing_input(
            label="Yes",
            fieldType="checkbox",
            wholeQuestionLabel="Do you require sponsorship?",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == True


def test_sponsorship_text_explanation_edge_case() -> None:
    """Test edge case where text input asks for sponsorship answer and explanation together"""

    # Save detailed sponsorship explanation
    save_inputs = [
        create_testing_input(
            label="Please provide your sponsorship status and any relevant details",
            fieldType="text",
            value="Yes, I will require H-1B sponsorship as I am currently on F-1 visa",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    # Should detect that user requires sponsorship from the text
    assert (
        updated_autofill_data["sponsorship"]["textAnswer"]
        == "Yes, I will require H-1B sponsorship as I am currently on F-1 visa"
    )

    # Test autofilling similar text field asking for sponsorship explanation
    autofill_inputs = [
        create_testing_input(
            label="Please explain your sponsorship needs",
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert (
        autofills[0]["value"]
        == "Yes, I will require H-1B sponsorship as I am currently on F-1 visa"
    )


def test_sponsorship_select_uncommon_field_type() -> None:
    """Test uncommon select field type for sponsorship questions"""

    # Set up sponsorship status - save via select to ensure it's stored properly
    save_inputs = [
        create_testing_input(
            label="",
            wholeQuestionLabel="Do you require sponsorship?",
            fieldType="select",
            value="No, I do not require sponsorship",
        ),
    ]
    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["sponsorship"]["yesNoAnswer"] == "no_sponsorship"

    # Test select field (uncommon but possible edge case) with clear sponsorship wording
    select_inputs = [
        create_testing_input(
            label="Do you require sponsorship",
            fieldType="select",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(select_inputs))
    assert autofills[0]["value"] == "No, I do not require sponsorship to work"
