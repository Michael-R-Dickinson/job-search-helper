from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.test_setup import (
    create_testing_input,
    get_testing_user,
    init_firebase_once,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_basic_name_autofill() -> None:
    """Test basic first/last name saving and autofilling with key variations"""
    init_firebase_once()

    # Save first and last names
    save_inputs = [
        create_testing_input(
            label="First Name",
            fieldType="text",
            value="John",
        ),
        create_testing_input(
            label="Family name",  # Test variation in save label
            fieldType="text",
            value="Doe",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["name"]["first_name"] == "John"
    assert updated_autofill_data["name"]["last_name"] == "Doe"

    # Test autofilling with different common variations (not direct matches)
    first_name_input = [
        create_testing_input(
            label="Given name",  # Different from saved "First Name"
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(first_name_input))
    assert autofills[0]["value"] == "John"

    last_name_input = [
        create_testing_input(
            label="Surname",  # Different from saved "Family name"
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(last_name_input))
    assert autofills[0]["value"] == "Doe"


def test_full_name_parsing_and_autofill() -> None:
    """Test critical full name parsing functionality and bidirectional autofill"""
    init_firebase_once()

    # Test saving a full name that gets parsed into first and last
    save_inputs = [
        create_testing_input(
            label="Complete name",  # Not exact match to canonical "Full Name"
            fieldType="text",
            value="Michael Johnson",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    # Should parse "Michael Johnson" into first: "Michael", last: "Johnson"
    assert updated_autofill_data["name"]["first_name"] == "Michael"
    assert updated_autofill_data["name"]["last_name"] == "Johnson"

    # Test that we can now autofill full name field with combined data
    full_name_input = [
        create_testing_input(
            label="Legal name",  # Different variation
            fieldType="text",
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(full_name_input))
    assert autofills[0]["value"] == "Michael Johnson"


def test_name_edge_cases() -> None:
    """Test important edge cases: special characters and uncommon field types"""
    init_firebase_once()

    # Test names with special characters (common in real applications)
    save_inputs = [
        create_testing_input(
            label="Given Name",
            fieldType="text",
            value="José",
        ),
        create_testing_input(
            label="Surname",
            fieldType="text",
            value="O'Connor-Smith",  # Hyphenated with apostrophe
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["name"]["first_name"] == "José"
    assert updated_autofill_data["name"]["last_name"] == "O'Connor-Smith"

    # Test uncommon field type - select field for names (edge case)
    name_select_input = [
        create_testing_input(
            label="Full Name",
            fieldType="select",  # Uncommon but possible
        ),
    ]
    autofills = get_filled_inputs(get_testing_user(), InputList(name_select_input))
    assert autofills[0]["value"] == "José O'Connor-Smith"
