from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_linkedin_url_basic_functionality() -> None:
    """Test basic LinkedIn URL saving and autofilling"""

    # Save LinkedIn URL
    linkedin_url = "https://linkedin.com/in/johndoe"
    save_inputs = [
        create_testing_input(
            label="LinkedIn Profile",
            fieldType="url",
            value=linkedin_url,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["linkedin_profile"] == linkedin_url

    # Test autofilling with different common variations
    linkedin_variations = [
        "LinkedIn URL",
        "LinkedIn Profile URL",
        "LinkedIn",
        "LinkedIn Profile",
        "Professional Profile",
    ]

    autofill_inputs = []
    for label in linkedin_variations:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="url",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill in autofills:
        assert autofill["value"] == linkedin_url


def test_github_url_basic_functionality() -> None:
    """Test basic GitHub URL saving and autofilling"""

    # Save GitHub URL
    github_url = "https://github.com/johndoe"
    save_inputs = [
        create_testing_input(
            label="GitHub Profile",
            fieldType="url",
            value=github_url,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["github_url"] == github_url

    # Test autofilling with different common variations
    github_variations = [
        "GitHub URL",
        "GitHub Profile URL",
        "GitHub",
        "GitHub Profile",
        "GitHub Username",
    ]

    autofill_inputs = []
    for label in github_variations:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="url",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill in autofills:
        assert autofill["value"] == github_url


def test_personal_website_basic_functionality() -> None:
    """Test basic personal website URL saving and autofilling"""

    # Save personal website URL
    website_url = "https://johndoe.com"
    save_inputs = [
        create_testing_input(
            label="Personal Website",
            fieldType="url",
            value=website_url,
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["website"] == website_url

    # Test autofilling with different common variations
    website_variations = [
        "Personal Website",
        "Portfolio URL",
        "Portfolio Website",
        "Personal Portfolio",
        "Website",
        "Portfolio",
    ]

    autofill_inputs = []
    for label in website_variations:
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="url",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill in autofills:
        assert autofill["value"] == website_url


def test_url_fields_different_input_types() -> None:
    """Test URL fields work with different input types (text, url)"""

    # Save URLs using different field types
    save_inputs = [
        create_testing_input(
            label="LinkedIn",
            fieldType="text",  # Sometimes URLs are text fields
            value="https://linkedin.com/in/testuser",
        ),
        create_testing_input(
            label="GitHub",
            fieldType="url",  # Standard URL field
            value="https://github.com/testuser",
        ),
        create_testing_input(
            label="Portfolio",
            fieldType="textbox",  # Sometimes larger text areas
            value="https://testuser.dev",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert (
        updated_autofill_data["linkedin_profile"] == "https://linkedin.com/in/testuser"
    )
    assert updated_autofill_data["github_url"] == "https://github.com/testuser"
    assert updated_autofill_data["website"] == "https://testuser.dev"

    # Test autofilling with mixed field types
    mixed_inputs = [
        create_testing_input(
            label="LinkedIn URL",
            fieldType="text",
        ),
        create_testing_input(
            label="GitHub URL",
            fieldType="url",
        ),
        create_testing_input(
            label="Website",
            fieldType="textbox",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(mixed_inputs))

    assert autofills[0]["value"] == "https://linkedin.com/in/testuser"
    assert autofills[1]["value"] == "https://github.com/testuser"
    assert autofills[2]["value"] == "https://testuser.dev"


def test_url_validation_and_edge_cases() -> None:
    """Test URL validation and edge cases"""

    # Test various URL formats
    url_test_cases = [
        # LinkedIn variations
        ("LinkedIn", "linkedin.com/in/user", "linkedin.com/in/user"),
        (
            "LinkedIn Profile",
            "https://www.linkedin.com/in/user-name",
            "https://www.linkedin.com/in/user-name",
        ),
        # GitHub variations
        ("GitHub", "github.com/username", "github.com/username"),
        (
            "GitHub Profile",
            "https://github.com/username/repo",
            "https://github.com/username/repo",
        ),
        # Website variations
        ("Portfolio", "johndoe.com", "johndoe.com"),
        (
            "Personal Website",
            "https://www.johndoe.com/portfolio",
            "https://www.johndoe.com/portfolio",
        ),
    ]

    for label, input_url, expected_url in url_test_cases:
        save_inputs = [
            create_testing_input(
                label=label,
                fieldType="url",
                value=input_url,
            ),
        ]

        updated_autofill_data = save_input_values(
            get_testing_user(), InputList(save_inputs)
        )

        # Test that the URL is saved exactly as entered (no modification)
        if "LinkedIn" in label:
            assert updated_autofill_data["linkedin_profile"] == expected_url
        elif "GitHub" in label:
            assert updated_autofill_data["github_url"] == expected_url
        else:  # Portfolio/Website
            assert updated_autofill_data["website"] == expected_url


def test_empty_url_handling() -> None:
    """Test handling of empty URL values"""

    # Test empty values don't overwrite existing data
    save_inputs = [
        create_testing_input(
            label="LinkedIn",
            fieldType="url",
            value="https://linkedin.com/in/originaluser",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert (
        updated_autofill_data["linkedin_profile"]
        == "https://linkedin.com/in/originaluser"
    )

    # Try to save empty value
    empty_save_inputs = [
        create_testing_input(
            label="LinkedIn Profile",
            fieldType="url",
            value="",
        ),
    ]

    # Empty values should not create save instructions
    # The original value should remain
    save_input_values(get_testing_user(), InputList(empty_save_inputs))

    # Verify the original value is still there by testing autofill
    autofill_inputs = [
        create_testing_input(
            label="LinkedIn URL",
            fieldType="url",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "https://linkedin.com/in/originaluser"


def test_url_handlers_can_autofill_when_data_exists() -> None:
    """Test that URL handlers work correctly when data exists"""

    # Save test URLs
    save_inputs = [
        create_testing_input(
            label="LinkedIn",
            fieldType="url",
            value="https://linkedin.com/in/test",
        ),
        create_testing_input(
            label="GitHub",
            fieldType="url",
            value="https://github.com/test",
        ),
        create_testing_input(
            label="Portfolio",
            fieldType="url",
            value="https://test.com",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    # Verify data was saved
    assert updated_autofill_data["linkedin_profile"] == "https://linkedin.com/in/test"
    assert updated_autofill_data["github_url"] == "https://github.com/test"
    assert updated_autofill_data["website"] == "https://test.com"

    # Test that our handlers can autofill when data exists
    autofill_inputs = [
        create_testing_input(
            label="LinkedIn Profile",
            fieldType="url",
        ),
        create_testing_input(
            label="GitHub Profile",
            fieldType="url",
        ),
        create_testing_input(
            label="Personal Website",
            fieldType="url",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))

    # Should return the saved URLs
    assert autofills[0]["value"] == "https://linkedin.com/in/test"
    assert autofills[1]["value"] == "https://github.com/test"
    assert autofills[2]["value"] == "https://test.com"
