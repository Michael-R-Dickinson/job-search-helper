import pytest
from datetime import datetime
from utils import (
    get_time_string,
    generate_uuid,
    pickle_object,
    get_objects_hash,
)


@pytest.mark.unit
class TestTimeUtils:
    def test_get_time_string_format(self):
        """Test that get_time_string returns correct format."""
        result = get_time_string()
        # Format should be: day_hour-minute-second (e.g., "24_14-30-45")
        assert len(result) == 11
        assert result[2] == "_"
        assert result[5] == "-"
        assert result[8] == "-"

    def test_get_time_string_is_current(self):
        """Test that get_time_string returns current day."""
        result = get_time_string()
        current_day = datetime.now().strftime("%d")
        assert result.startswith(current_day)


@pytest.mark.unit
class TestUUIDGeneration:
    def test_generate_uuid_returns_string(self):
        """Test that generate_uuid returns a string."""
        result = generate_uuid()
        assert isinstance(result, str)

    def test_generate_uuid_length(self):
        """Test that generate_uuid returns 32 character hex string."""
        result = generate_uuid()
        assert len(result) == 32

    def test_generate_uuid_uniqueness(self):
        """Test that generate_uuid returns unique values."""
        uuid1 = generate_uuid()
        uuid2 = generate_uuid()
        assert uuid1 != uuid2


@pytest.mark.unit
class TestPickling:
    def test_pickle_object_simple_dict(self):
        """Test pickling a simple dictionary."""
        obj = {"key": "value", "number": 42}
        result = pickle_object(obj)
        assert isinstance(result, str)
        assert len(result) > 0

    def test_pickle_object_list(self):
        """Test pickling a list."""
        obj = [1, 2, 3, "test"]
        result = pickle_object(obj)
        assert isinstance(result, str)

    def test_pickle_object_nested(self):
        """Test pickling nested structures."""
        obj = {"outer": {"inner": [1, 2, 3]}}
        result = pickle_object(obj)
        assert isinstance(result, str)


@pytest.mark.unit
class TestHashing:
    def test_get_objects_hash_returns_string(self):
        """Test that get_objects_hash returns a string."""
        result = get_objects_hash("test", 123)
        assert isinstance(result, str)

    def test_get_objects_hash_consistency(self):
        """Test that same inputs produce same hash."""
        hash1 = get_objects_hash("test", 123, {"key": "value"})
        hash2 = get_objects_hash("test", 123, {"key": "value"})
        assert hash1 == hash2

    def test_get_objects_hash_different_inputs(self):
        """Test that different inputs produce different hashes."""
        hash1 = get_objects_hash("test", 123)
        hash2 = get_objects_hash("test", 456)
        assert hash1 != hash2

    def test_get_objects_hash_custom_digest_size(self):
        """Test that custom digest size affects hash length."""
        hash_small = get_objects_hash("test", digest_size=4)
        hash_large = get_objects_hash("test", digest_size=16)
        assert len(hash_small) < len(hash_large)
