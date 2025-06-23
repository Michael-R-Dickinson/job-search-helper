from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_job_discovery_never_saves_data() -> None:
    """Test that job discovery responses are never saved to the database"""

    # Get baseline autofill data by saving a non-job-discovery input
    baseline_input = [
        create_testing_input(
            label="John",
            fieldType="text",
            value="John",
        ),
    ]
    baseline_autofill_data = save_input_values(
        get_testing_user(), InputList(baseline_input)
    )

    # Try to save job discovery inputs
    save_inputs = [
        create_testing_input(
            label="LinkedIn",
            wholeQuestionLabel="How did you hear about this position?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="Job Board",
            wholeQuestionLabel="How did you hear about this position?",
            fieldType="radio",
            value=False,
        ),
    ]

    # Save job discovery inputs - should not change autofill data
    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    # Should be identical - no job discovery data saved
    assert updated_autofill_data == baseline_autofill_data

    # Test with select input as well
    select_save_inputs = [
        create_testing_input(
            label="Company website",
            wholeQuestionLabel="How did you find out about us?",
            fieldType="select",
            value="Company website",
        ),
    ]

    final_autofill_data = save_input_values(
        get_testing_user(), InputList(select_save_inputs)
    )

    # Still should be identical - no job discovery data saved
    assert final_autofill_data == baseline_autofill_data


def test_job_discovery_select_field_response() -> None:
    """Test that select fields return the standard pipe-separated LinkedIn options"""

    # Test the primary select field format
    autofill_inputs = [
        create_testing_input(
            label="How did you hear about this position?",
            fieldType="select",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert (
        autofills[0]["value"] == "Linkedin|Job Board|linkedin profile|company website"
    )

    # Test with wholeQuestionLabel instead of label
    autofill_inputs = [
        create_testing_input(
            label="",
            wholeQuestionLabel="How did you hear about this job opening?",
            fieldType="select",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert (
        autofills[0]["value"] == "Linkedin|Job Board|linkedin profile|company website"
    )


def test_job_discovery_radio_linkedin_preference() -> None:
    """Test that radio buttons prefer LinkedIn options when available"""

    # Test simple case with LinkedIn option
    autofill_inputs = [
        create_testing_input(
            label="Company website",
            wholeQuestionLabel="How did you hear about us?",
            fieldType="radio",
        ),
        create_testing_input(
            label="LinkedIn",
            wholeQuestionLabel="How did you hear about us?",
            fieldType="radio",
        ),
        create_testing_input(
            label="Employee referral",
            wholeQuestionLabel="How did you hear about us?",
            fieldType="radio",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # Should select the LinkedIn option (True) and others False
    linkedin_selected = False
    for autofill in autofills:
        if "linkedin" in autofill["input_text"].lower():
            assert autofill["value"] == True, "LinkedIn option should be selected"
            linkedin_selected = True
        else:
            assert (
                autofill["value"] == False
            ), f"Non-LinkedIn options should be False: {autofill['input_text']}"

    assert linkedin_selected, "LinkedIn option should have been found and selected"


def test_job_discovery_radio_fallback_to_first() -> None:
    """Test that radio buttons select first option when no LinkedIn option available"""

    # Test without any LinkedIn options
    autofill_inputs = [
        create_testing_input(
            label="Company website",
            wholeQuestionLabel="How did you hear about us?",
            fieldType="radio",
        ),
        create_testing_input(
            label="Job fair",
            wholeQuestionLabel="How did you hear about us?",
            fieldType="radio",
        ),
        create_testing_input(
            label="Employee referral",
            wholeQuestionLabel="How did you hear about us?",
            fieldType="radio",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # First option should be True, others False
    assert (
        autofills[0]["value"] == True
    ), "First radio option should be selected when no LinkedIn available"
    assert autofills[1]["value"] == False, "Second radio option should be False"
    assert autofills[2]["value"] == False, "Third radio option should be False"


def test_job_discovery_text_input_response() -> None:
    """Test that text inputs return LinkedIn as the response"""

    # Test text input with clear job discovery context
    autofill_inputs = [
        create_testing_input(
            label="How did you hear about this position?",
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "LinkedIn"

    # Test with wholeQuestionLabel
    autofill_inputs = [
        create_testing_input(
            label="",
            wholeQuestionLabel="How did you discover this opportunity?",
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "LinkedIn"


def test_job_discovery_checkbox_linkedin_preference() -> None:
    """Test that checkboxes prefer LinkedIn options when available"""

    # Test with LinkedIn checkbox available
    autofill_inputs = [
        create_testing_input(
            label="Company website",
            wholeQuestionLabel="How did you hear about us? (Check all that apply)",
            fieldType="checkbox",
        ),
        create_testing_input(
            label="LinkedIn",
            wholeQuestionLabel="How did you hear about us? (Check all that apply)",
            fieldType="checkbox",
        ),
        create_testing_input(
            label="Job fair",
            wholeQuestionLabel="How did you hear about us? (Check all that apply)",
            fieldType="checkbox",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # Should check LinkedIn option only
    for autofill in autofills:
        if "linkedin" in autofill["input_text"].lower():
            assert autofill["value"] == True, "LinkedIn checkbox should be checked"
        else:
            assert (
                autofill["value"] == False
            ), f"Non-LinkedIn checkbox should be unchecked: {autofill['input_text']}"


def test_job_discovery_checkbox_fallback_to_first() -> None:
    """Test that checkboxes select first option when no LinkedIn available"""

    # Test without LinkedIn options
    autofill_inputs = [
        create_testing_input(
            label="Company website",
            wholeQuestionLabel="How did you hear about us? (Check all that apply)",
            fieldType="checkbox",
        ),
        create_testing_input(
            label="Employee referral",
            wholeQuestionLabel="How did you hear about us? (Check all that apply)",
            fieldType="checkbox",
        ),
        create_testing_input(
            label="Job board",
            wholeQuestionLabel="How did you hear about us? (Check all that apply)",
            fieldType="checkbox",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # First option should be True, others False
    assert (
        autofills[0]["value"] == True
    ), "First checkbox should be checked when no LinkedIn available"
    assert autofills[1]["value"] == False, "Second checkbox should be unchecked"
    assert autofills[2]["value"] == False, "Third checkbox should be unchecked"


def test_job_discovery_edge_cases() -> None:
    """Test edge cases and variations in job discovery questions"""

    # Test LinkedIn as part of longer text
    autofill_inputs = [
        create_testing_input(
            label="Found through LinkedIn networking",
            wholeQuestionLabel="How did you learn about this role?",
            fieldType="radio",
        ),
        create_testing_input(
            label="Company career page",
            wholeQuestionLabel="How did you learn about this role?",
            fieldType="radio",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == True, "LinkedIn networking should be selected"
    assert autofills[1]["value"] == False, "Career page should not be selected"

    # Test single radio button without LinkedIn
    single_radio_inputs = [
        create_testing_input(
            label="Other source",
            wholeQuestionLabel="Referral source",
            fieldType="radio",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(single_radio_inputs))
    assert (
        autofills[0]["value"] == True
    ), "Single radio without LinkedIn should be selected"


def test_job_discovery_common_question_variations() -> None:
    """Test various ways companies ask about job discovery"""

    # Test different question phrasings with select fields (reduced to avoid rate limits)
    question_variations = [
        "How did you find out about us?",
        "Where did you learn about this opportunity?",
        "Referral source",
    ]

    for question in question_variations:
        autofill_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel=question,
                fieldType="select",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"]
            == "Linkedin|Job Board|linkedin profile|company website"
        ), f"Failed for question: {question}"
