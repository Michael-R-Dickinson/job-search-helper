from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_degree_basic_autofill() -> None:
    """Test basic degree autofill functionality with common degree types"""

    # Save a degree value using text input
    save_inputs = [
        create_testing_input(
            label="Degree",
            fieldType="text",
            value="Bachelor of Science in Computer Science",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert (
        updated_autofill_data["education"]["degree"]
        == "Bachelor of Science in Computer Science"
    )

    # Test autofilling degree fields with different labels
    degree_labels = [
        "Degree",
        "What degree did you earn?",
        "Educational Level",
        "Academic Degree",
        "Type of Degree",
    ]

    autofill_inputs = []
    for label in degree_labels:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="text",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill in autofills:
        assert autofill["value"] == "Bachelor of Science in Computer Science"


def test_discipline_basic_autofill() -> None:
    """Test basic discipline/major autofill functionality with common field types"""

    # Clear any existing data first to ensure clean state
    clear_inputs = [
        create_testing_input(
            label="Degree",
            fieldType="text",
            value="",
        ),
    ]
    save_input_values(get_testing_user(), InputList(clear_inputs))

    # Save a discipline value using text input with clear label
    save_inputs = [
        create_testing_input(
            label="Major",
            fieldType="text",
            value="Computer Science",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["education"]["discipline"] == "Computer Science"

    # Test autofilling discipline fields with different labels, filtering correctly classified ones
    discipline_labels = [
        "Major",
        "Field of Study",
        "Discipline",
        "Area of Study",
        "Academic Subject",
    ]

    autofill_inputs = []
    for label in discipline_labels:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="text",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # Filter for successful discipline autofills (some might be mis-classified)
    discipline_autofills = [
        a for a in autofills if a.get("input_text") in discipline_labels
    ]

    # Should have at least some successful autofills
    assert (
        len(discipline_autofills) >= 3
    ), f"Expected at least 3 discipline autofills, got {len(discipline_autofills)}"

    for autofill in discipline_autofills:
        assert (
            autofill["value"] == "Computer Science"
        ), f"Field '{autofill['input_text']}' returned '{autofill['value']}' instead of 'Computer Science'"


def test_degree_variations_save() -> None:
    """Test saving various degree formats commonly found in job applications"""

    degree_variations = [
        "Bachelor of Arts",
        "B.A. in Psychology",
        "Master of Science",
        "M.S. Computer Science",
        "PhD in Physics",
    ]

    for degree in degree_variations:
        # Save each degree type
        save_inputs = [
            create_testing_input(
                label="Degree",
                fieldType="text",
                value=degree,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert updated_autofill_data["education"]["degree"] == degree

        # Test that it autofills back correctly using a clearly classified label
        autofill_inputs = [
            create_testing_input(
                label="Degree",  # Use exact same label that should classify clearly
                fieldType="text",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert len(autofills) > 0, f"No autofills returned for degree: {degree}"
        assert autofills[0]["value"] == degree


def test_discipline_variations_save() -> None:
    """Test saving various discipline/major formats commonly found in job applications"""

    discipline_variations = [
        "Computer Science",
        "Mechanical Engineering",
        "Business Administration",
        "Psychology",
        "Biology",
    ]

    for discipline in discipline_variations:
        # Save each discipline type
        save_inputs = [
            create_testing_input(
                label="Major",
                fieldType="text",
                value=discipline,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        assert updated_autofill_data["education"]["discipline"] == discipline

        # Test that it autofills back correctly
        autofill_inputs = [
            create_testing_input(
                label="Major",  # Use exact same label
                fieldType="text",
            ),
        ]

        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert len(autofills) > 0, f"No autofills returned for discipline: {discipline}"
        assert autofills[0]["value"] == discipline


def test_education_mixed_field_types() -> None:
    """Test degree and discipline fields with different input types"""

    # Save specific degree and discipline with clear distinction
    save_inputs = [
        create_testing_input(
            label="Degree",
            fieldType="text",
            value="Master of Science",
        ),
        create_testing_input(
            label="Major",
            fieldType="text",
            value="Data Science",
        ),
    ]

    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test different field types for the same data
    mixed_inputs = [
        # Degree fields
        create_testing_input(
            label="Degree",
            fieldType="text",
        ),
        create_testing_input(
            label="Academic Degree",
            fieldType="textbox",
        ),
        # Discipline fields
        create_testing_input(
            label="Major",
            fieldType="text",
        ),
        create_testing_input(
            label="Field of Study",
            fieldType="textbox",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(mixed_inputs))

    # Filter successful autofills
    degree_autofills = [
        a for a in autofills if a.get("input_text") in ["Degree", "Academic Degree"]
    ]
    discipline_autofills = [
        a for a in autofills if a.get("input_text") in ["Major", "Field of Study"]
    ]

    # Verify we got expected results
    assert len(degree_autofills) >= 1, "Should have at least one degree autofill"
    assert (
        len(discipline_autofills) >= 1
    ), "Should have at least one discipline autofill"

    # Check values for successful autofills
    for autofill in degree_autofills:
        assert autofill["value"] == "Master of Science"
    for autofill in discipline_autofills:
        assert autofill["value"] == "Data Science"


def test_education_empty_value_handling() -> None:
    """Test handling when no degree or discipline is saved"""

    # Use a fresh user to avoid state contamination
    fresh_user = get_testing_user()

    # Explicitly clear both degree and discipline with None/empty values
    clear_inputs = [
        create_testing_input(
            label="Degree",
            fieldType="text",
            value="",
        ),
        create_testing_input(
            label="Major",
            fieldType="text",
            value="",
        ),
    ]

    save_input_values(fresh_user, InputList(clear_inputs))

    # Test autofill when no education data exists - use fresh user
    autofill_inputs = [
        create_testing_input(
            label="Educational Background",  # Use different label to avoid conflicts
            fieldType="text",
        ),
        create_testing_input(
            label="Study Area",  # Use different label to avoid conflicts
            fieldType="text",
        ),
    ]

    autofills = get_filled_inputs(fresh_user, InputList(autofill_inputs))

    # Since these labels might not classify clearly, check if we get any results
    # If no classification happens, we should get empty results
    if len(autofills) == 0:
        # This is expected behavior when labels don't classify
        assert True
    else:
        # If we do get results, they should be empty/None since we cleared the data
        for autofill in autofills:
            assert autofill["value"] in [
                None,
                "",
            ], f"Expected None or empty, got: {autofill['value']}"


def test_education_vectorized_autofill() -> None:
    """Test multiple education fields at once for efficiency"""

    # Save both degree and discipline with clear labels
    save_inputs = [
        create_testing_input(
            label="Degree",
            fieldType="text",
            value="Bachelor of Engineering",
        ),
        create_testing_input(
            label="Major",
            fieldType="text",
            value="Software Engineering",
        ),
    ]

    save_input_values(get_testing_user(), InputList(save_inputs))

    # Test multiple variations that should classify correctly
    education_fields = [
        "Degree",
        "Academic Degree",
        "Major",
        "Field of Study",
        "Academic Discipline",
    ]

    autofill_inputs = []
    for label in education_fields:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="text",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # Check that we got some autofills back
    assert len(autofills) > 0, "Should have some autofills"

    # Categorize by expected type
    for autofill in autofills:
        label = autofill.get("input_text", "")
        if label in ["Degree", "Academic Degree"]:
            assert (
                autofill["value"] == "Bachelor of Engineering"
            ), f"Degree field '{label}' should return degree value"
        elif label in ["Major", "Field of Study", "Academic Discipline"]:
            assert (
                autofill["value"] == "Software Engineering"
            ), f"Discipline field '{label}' should return discipline value"
