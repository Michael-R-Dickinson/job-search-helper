import pytest
from functions.validation import (
    validate_linkedin_url,
    validate_file_name,
    validate_file_name_and_userId,
)


@pytest.mark.unit
class TestLinkedInURLValidation:
    def test_validate_linkedin_url_recommended_format(self):
        """Test validation of recommended collections format."""
        url = "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4223055571"
        assert validate_linkedin_url(url) is True

    def test_validate_linkedin_url_view_format(self):
        """Test validation of job view format."""
        url = "https://www.linkedin.com/jobs/view/4223055571/?alternateChannel=search"
        assert validate_linkedin_url(url) is True

    def test_validate_linkedin_url_search_format(self):
        """Test validation of search format."""
        url = "https://www.linkedin.com/jobs/search/?alertAction=viewjobs&currentJobId=4072935908&origin=JOBS_HOME_JOB_ALERTS&savedSearchId=14717622332"
        assert validate_linkedin_url(url) is True

    def test_validate_linkedin_url_invalid_domain(self):
        """Test that non-LinkedIn URLs are rejected."""
        url = "https://www.example.com/jobs/view/123"
        assert validate_linkedin_url(url) is False

    def test_validate_linkedin_url_invalid_path(self):
        """Test that invalid LinkedIn paths are rejected."""
        url = "https://www.linkedin.com/in/someprofile"
        assert validate_linkedin_url(url) is False

    def test_validate_linkedin_url_missing_protocol(self):
        """Test that URLs without https are rejected."""
        url = "www.linkedin.com/jobs/view/4223055571/"
        assert validate_linkedin_url(url) is False


@pytest.mark.unit
class TestFileNameValidation:
    def test_validate_file_name_valid_simple(self):
        """Test validation of simple valid filename."""
        assert validate_file_name("resume.docx") is True

    def test_validate_file_name_valid_with_spaces(self):
        """Test validation of filename with spaces."""
        assert validate_file_name("My Resume 2024.docx") is True

    def test_validate_file_name_valid_with_underscores(self):
        """Test validation of filename with underscores."""
        assert validate_file_name("john_doe_resume.docx") is True

    def test_validate_file_name_valid_with_hyphens(self):
        """Test validation of filename with hyphens."""
        assert validate_file_name("resume-final-v2.docx") is True

    def test_validate_file_name_invalid_extension(self):
        """Test that non-.docx files are rejected."""
        assert validate_file_name("resume.pdf") is False

    def test_validate_file_name_no_extension(self):
        """Test that files without extension are rejected."""
        assert validate_file_name("resume") is False

    def test_validate_file_name_invalid_characters(self):
        """Test that filenames with invalid characters are rejected."""
        assert validate_file_name("resume@#$.docx") is False

    def test_validate_file_name_empty(self):
        """Test that empty string is rejected."""
        assert validate_file_name("") is False


@pytest.mark.unit
class TestFileNameAndUserIdValidation:
    def test_validate_file_name_and_userId_valid(self):
        """Test validation with valid inputs."""
        # Should not raise
        validate_file_name_and_userId("user123", "resume.docx")

    def test_validate_file_name_and_userId_missing_userId(self):
        """Test that missing userId raises ValueError."""
        with pytest.raises(ValueError, match="Missing userId or fileName"):
            validate_file_name_and_userId("", "resume.docx")

    def test_validate_file_name_and_userId_missing_fileName(self):
        """Test that missing fileName raises ValueError."""
        with pytest.raises(ValueError, match="Missing userId or fileName"):
            validate_file_name_and_userId("user123", "")

    def test_validate_file_name_and_userId_none_values(self):
        """Test that None values raise ValueError."""
        with pytest.raises(ValueError, match="Missing userId or fileName"):
            validate_file_name_and_userId(None, None)

    def test_validate_file_name_and_userId_invalid_file_name(self):
        """Test that invalid file name raises ValueError."""
        with pytest.raises(ValueError, match="Invalid file name"):
            validate_file_name_and_userId("user123", "resume.pdf")

    def test_validate_file_name_and_userId_invalid_characters(self):
        """Test that file name with invalid characters raises ValueError."""
        with pytest.raises(ValueError, match="Invalid file name"):
            validate_file_name_and_userId("user123", "resume@#$.docx")
