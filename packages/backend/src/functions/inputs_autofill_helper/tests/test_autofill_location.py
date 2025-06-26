from functions.inputs_autofill_helper.autofill_schema import (
    InputList,
)
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.tests.conftest import (
    create_testing_input,
    get_testing_user,
)
from functions.save_filled_values_helper.input_saver import save_input_values


def test_basic_location_components_save_and_autofill() -> None:
    """Test saving and autofilling basic location components"""

    # Save individual location components
    save_inputs = [
        create_testing_input(
            label="Street Address",
            fieldType="text",
            value="123 Main Street",
        ),
        create_testing_input(
            label="City",
            fieldType="text",
            value="San Francisco",
        ),
        create_testing_input(
            label="State",
            fieldType="select",
            value="California",
        ),
        create_testing_input(
            label="ZIP Code",
            fieldType="text",
            value="94102",
        ),
        create_testing_input(
            label="Country",
            fieldType="select",
            value="United States",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    # Debug print to see what's actually being saved
    print(f"Location data: {updated_autofill_data.get('location', {})}")

    # Verify saved to correct schema locations
    assert updated_autofill_data["location"]["address"] == "123 Main Street"
    assert updated_autofill_data["location"]["city"] == "San Francisco"
    assert updated_autofill_data["location"]["state"] == "California"
    assert updated_autofill_data["location"]["postal_code"] == "94102"
    assert updated_autofill_data["location"]["country"] == "usa"

    # Test autofilling with common label variations (not direct matches)
    autofill_inputs = [
        create_testing_input(
            label="Home Address",  # Different from saved "Street Address"
            fieldType="text",
        ),
        create_testing_input(
            label="Town/City",  # Different from saved "City"
            fieldType="text",
        ),
        create_testing_input(
            label="Province/State",  # Different from saved "State"
            fieldType="select",
        ),
        create_testing_input(
            label="Postal Code",  # Different from saved "ZIP Code"
            fieldType="text",
        ),
        create_testing_input(
            label="Country",
            fieldType="text",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "123 Main Street"
    assert autofills[1]["value"] == "San Francisco"
    assert autofills[2]["value"] == "California"
    assert autofills[3]["value"] == "94102"
    assert autofills[4]["value"] == "United States"


def test_address_format_variations() -> None:
    """Test different address format variations commonly used"""

    # Test apartment/unit number included in address
    save_inputs = [
        create_testing_input(
            label="Address Line 1",
            fieldType="text",
            value="456 Oak Avenue Apt 2B",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["location"]["address"] == "456 Oak Avenue Apt 2B"

    # Test various address field labels
    address_variations = [
        "Residence Address",
        "Physical Address",
        "Mailing Address",
        "Home Street Address",
        "Address Line 1",
    ]

    for label in address_variations:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType="text",
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert autofills[0]["value"] == "456 Oak Avenue Apt 2B", f"for label: {label}"


def test_country_variations() -> None:
    """Test state and country autofill in various select field formats"""

    # Save state as abbreviation and country in different format
    save_inputs = [
        create_testing_input(
            label="State/Province",
            fieldType="select",
            value="CA",
        ),
        create_testing_input(
            label="Country of Residence",
            fieldType="select",
            value="USA",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["location"]["state"] == "CA"
    assert updated_autofill_data["location"]["country"] == "usa"

    # Test autofilling with different state/country labels
    autofill_inputs = [
        create_testing_input(
            label="State",
            fieldType="select",
        ),
        create_testing_input(
            label="Nation",
            fieldType="select",
        ),
    ]

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    assert autofills[0]["value"] == "CA"
    assert autofills[1]["value"] == "United States|United States of America|USA|US"


def test_postal_code_variations() -> None:
    """Test postal code/zip code in different formats and field types"""

    # Test international postal code format
    save_inputs = [
        create_testing_input(
            label="Postcode",
            fieldType="text",
            value="M5V 3L9",  # Canadian postal code format
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )
    assert updated_autofill_data["location"]["postal_code"] == "M5V 3L9"

    # Test various postal code labels and field types
    postal_variations = [
        ("ZIP", "text"),
        ("Zip Code", "text"),
        ("Postal Code", "number"),  # Sometimes number type
        ("Post Code", "text"),
    ]

    for label, field_type in postal_variations:
        autofill_inputs = [
            create_testing_input(
                label=label,
                fieldType=field_type,
            ),
        ]
        autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
        assert autofills[0]["value"] == "M5V 3L9"


def test_general_location_variants() -> None:
    """Test distinguishing current location from permanent address fields"""

    # Save current location information
    save_inputs = [
        create_testing_input(
            label="Current City",
            fieldType="text",
            value="Austin",
        ),
        create_testing_input(
            label="Current State",
            fieldType="select",
            value="Texas",
        ),
        create_testing_input(
            label="Current Country",
            fieldType="select",
            value="United States",
        ),
        create_testing_input(
            label="Address",
            fieldType="text",
            value="123 Main St",
        ),
        create_testing_input(
            label="Postal Code",
            fieldType="text",
            value="78701",
        ),
    ]

    updated_autofill_data = save_input_values(
        get_testing_user(), InputList(save_inputs)
    )

    assert updated_autofill_data["location"]["city"] == "Austin"
    assert updated_autofill_data["location"]["state"] == "Texas"

    # Test various current/permanent location labels
    location_context_variations = {
        "Present City": "Austin",
        "Your location": "Austin, Texas, 78701, United States",
        "Current Location": "Austin, Texas, 78701, United States",
    }

    autofill_inputs = []
    for label in location_context_variations.keys():
        autofill_inputs.append(
            create_testing_input(
                label=label,
                fieldType="text",
            ),
        )

    autofills = get_filled_inputs(get_testing_user(), InputList(autofill_inputs))
    for autofill, expected_value in zip(
        autofills, location_context_variations.values()
    ):
        print(f"autofill: {autofill['value']}, expected: {expected_value}")
        assert autofill["value"] == expected_value
