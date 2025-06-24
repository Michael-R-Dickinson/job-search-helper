from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_hispanic_latino_radio_autofill_common_formats() -> None:
    """Test the most common Hispanic/Latino radio button formats in job applications"""

    # Save Hispanic/Latino status using the most common format
    save_inputs = [
        create_testing_input(
            label="Yes, I am Hispanic or Latino",
            wholeQuestionLabel="Are you Hispanic or Latino?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="No, I am not Hispanic or Latino",
            wholeQuestionLabel="Are you Hispanic or Latino?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["race"]["hispanic_latino"] == "yes"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to yes CANONICALS
        ("Yes", True),
        ("Hispanic", True),
        ("Latino", True),
        ("Latina", True),
        ("Latinx", True),
        # Direct matches to no CANONICALS
        ("No", False),
        ("Not Hispanic", False),
        ("Non-Latino", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Hispanic or Latino identity",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        # For yes, it should be True; for no variations, it should be False
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_transgender_radio_autofill_common_formats() -> None:
    """Test the most common transgender radio button formats in job applications"""

    # Save transgender status using the most common format
    save_inputs = [
        create_testing_input(
            label="No, I am not transgender",
            wholeQuestionLabel="Are you transgender?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="Yes, I am transgender",
            wholeQuestionLabel="Are you transgender?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["identity"]["transgender"] == "no"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to no CANONICALS (saved state)
        ("No", True),
        ("No, I am not transgender", True),
        ("Not transgender", True),
        ("Cisgender", True),
        ("Cis", True),
        # Direct matches to yes CANONICALS
        ("Yes", False),
        ("Yes, I am transgender", False),
        ("Transgender", False),
        ("Trans", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Transgender identity",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        # For our saved "no" state, matching "no" should be True
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_veteran_radio_autofill_common_formats() -> None:
    """Test the most common veteran status radio button formats in job applications"""

    # Save veteran status using the most common format
    save_inputs = [
        create_testing_input(
            label="Yes, I am a protected veteran",
            wholeQuestionLabel="Are you a veteran?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="No, I am not a veteran",
            wholeQuestionLabel="Are you a veteran?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["veteran"] == "protected_veteran"

    # Test autofilling critical variations that match existing CANONICALS
    test_cases = [
        # Direct matches to protected_veteran CANONICALS
        ("Yes", True),
        ("Protected veteran", True),
        ("Veteran", True),
        ("Military veteran", True),
        # Direct matches to not_veteran CANONICALS
        ("No", False),
        ("Not a veteran", False),
        ("Non-veteran", False),
        ("Civilian", False),
    ]

    for label, expected_value in test_cases:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="radio",
                wholeQuestionLabel="Veteran status",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        # For protected_veteran, matching options should be True
        assert autofills[0]["value"] == expected_value, f"Failed for label: {label}"


def test_identity_status_text_autofill_variations() -> None:
    """Test text input autofill with different identity/status values"""

    # Test Hispanic/Latino text responses
    hispanic_test_cases = [
        ("yes", "Yes, I am Hispanic or Latino"),
        ("no", "No, I am not Hispanic or Latino"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for hispanic_value, expected_text in hispanic_test_cases:
        # Save the Hispanic/Latino value
        save_inputs = [
            create_testing_input(
                label=expected_text,
                wholeQuestionLabel="Hispanic or Latino",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Hispanic/Latino",
                fieldType="text",
                wholeQuestionLabel="Please specify your ethnicity",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"] == expected_text
        ), f"Failed for Hispanic: {hispanic_value}"

    # Test transgender text responses
    transgender_test_cases = [
        ("yes", "Yes, I am transgender"),
        ("no", "No, I am not transgender"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for trans_value, expected_text in transgender_test_cases:
        # Save the transgender value
        save_inputs = [
            create_testing_input(
                label=expected_text,
                wholeQuestionLabel="Transgender",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Transgender",
                fieldType="text",
                wholeQuestionLabel="Please specify your gender identity",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"] == expected_text
        ), f"Failed for Transgender: {trans_value}"

    # Test veteran text responses
    veteran_test_cases = [
        ("protected_veteran", "Yes, I am a protected veteran"),
        ("not_veteran", "No, I am not a veteran"),
        ("prefer_not_to_say", "I prefer not to say"),
    ]

    for veteran_value, expected_text in veteran_test_cases:
        # Save the veteran value
        save_inputs = [
            create_testing_input(
                label=expected_text,
                wholeQuestionLabel="Veteran status",
                fieldType="select",
                value=expected_text,
            ),
        ]
        save_input_values(get_testing_user(), InputList(save_inputs))

        # Test autofilling text input
        autofill_inputs = [
            create_testing_input(
                label="Veteran status",
                fieldType="text",
                wholeQuestionLabel="Please specify your veteran status",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert (
            autofills[0]["value"] == expected_text
        ), f"Failed for Veteran: {veteran_value}"


def test_identity_status_save_critical_variations() -> None:
    """Test saving the most critical input variations found in job applications"""

    # Test Hispanic/Latino variations
    hispanic_cases = [
        ("Yes", "yes"),
        ("Hispanic", "yes"),
        ("Latino", "yes"),
        ("Latina", "yes"),
        ("Latinx", "yes"),
        ("No", "no"),
        ("Not Hispanic", "no"),
        ("Non-Latino", "no"),
        ("prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in hispanic_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="Are you Hispanic or Latino?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["race"]["hispanic_latino"] == expected_canonical
        ), f"Failed for Hispanic input: {input_value}"

    # Test transgender variations
    transgender_cases = [
        ("Yes", "yes"),
        ("Transgender", "yes"),
        ("Trans", "yes"),
        ("No", "no"),
        ("Not transgender", "no"),
        ("Cisgender", "no"),
        ("Cis", "no"),
        ("prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in transgender_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="Are you transgender?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["identity"]["transgender"] == expected_canonical
        ), f"Failed for Transgender input: {input_value}"

    # Test veteran variations
    veteran_cases = [
        ("Yes", "protected_veteran"),
        ("Veteran", "protected_veteran"),
        ("Protected veteran", "protected_veteran"),
        ("Military veteran", "protected_veteran"),
        ("No", "not_veteran"),
        ("Not a veteran", "not_veteran"),
        ("Non-veteran", "not_veteran"),
        ("Civilian", "not_veteran"),
        ("prefer not to say", "prefer_not_to_say"),
    ]

    for input_value, expected_canonical in veteran_cases:
        save_inputs = [
            create_testing_input(
                label="",
                wholeQuestionLabel="Are you a veteran?",
                fieldType="select",
                value=input_value,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert (
            updated_autofill_data["veteran"] == expected_canonical
        ), f"Failed for Veteran input: {input_value}"


def test_identity_status_select_autofill_vectorized() -> None:
    """Test select input autofill with multiple variations at once for efficiency"""

    # Save Hispanic/Latino yes status
    save_inputs = [
        create_testing_input(
            label="Hispanic",
            wholeQuestionLabel="Ethnicity",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test multiple select variations in one call
    select_variations = [
        "Hispanic or Latino",
        "Are you Hispanic or Latino?",
        "Ethnicity",
        "Hispanic/Latino identity",
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

    # All should return the canonical options for Hispanic/Latino yes
    expected_options = (
        "Yes|Yes, I am Hispanic or Latino|Hispanic|Latino|Latina|Latinx|Si|Sí"
    )
    for autofill in autofills:
        assert autofill["value"] == expected_options


def test_identity_status_checkbox_edge_cases() -> None:
    """Test uncommon but possible checkbox inputs for identity/status fields"""

    # Test checking transgender checkbox
    save_inputs = [
        create_testing_input(
            label="Transgender",
            wholeQuestionLabel="Identity options",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["identity"]["transgender"] == "yes"

    # Test checking veteran checkbox
    save_inputs = [
        create_testing_input(
            label="Veteran",
            wholeQuestionLabel="Status options",
            fieldType="checkbox",
            value=True,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["veteran"] == "protected_veteran"


def test_identity_status_mixed_field_types() -> None:
    """Test multiple field types with similar labels to ensure proper handling"""

    # Save Hispanic/Latino no status
    save_inputs = [
        create_testing_input(
            label="No",
            wholeQuestionLabel="Hispanic or Latino",
            fieldType="radio",
            value=True,
        ),
    ]
    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test different field types with similar labels
    mixed_inputs = [
        create_testing_input(
            label="Hispanic or Latino",
            fieldType="text",
        ),
        create_testing_input(
            label="Ethnicity",
            fieldType="select",
        ),
        create_testing_input(
            label="Yes",
            fieldType="radio",
            wholeQuestionLabel="Are you Hispanic or Latino?",
        ),
        create_testing_input(
            label="No",
            fieldType="radio",
            wholeQuestionLabel="Are you Hispanic or Latino?",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(mixed_inputs))

    # Text should return "No, I am not Hispanic or Latino"
    assert autofills[0]["value"] == "No, I am not Hispanic or Latino"
    # Select should return canonical options for no
    assert (
        autofills[1]["value"]
        == "No|No, I am not Hispanic or Latino|Not Hispanic|Not Latino|Non-Hispanic|Non-Latino"
    )
    # Yes radio should be False (doesn't match saved "no" value)
    assert autofills[2]["value"] == False
    # No radio should be True (matches saved "no" value)
    assert autofills[3]["value"] == True
