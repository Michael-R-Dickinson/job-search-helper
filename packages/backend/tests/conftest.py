import os
import pytest
from unittest.mock import Mock, patch
from dotenv import load_dotenv


@pytest.fixture(scope="session", autouse=True)
def load_env_vars():
    """Load environment variables from .env file before all tests."""
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(env_path)
    yield


@pytest.fixture
def mock_env_vars(monkeypatch):
    """Fixture to override specific environment variables for testing."""
    def _set_env(**kwargs):
        for key, value in kwargs.items():
            monkeypatch.setenv(key, value)
    return _set_env


@pytest.fixture
def test_user_id():
    """Consistent test user ID for tests."""
    return "test_user_123"


@pytest.fixture
def sample_job_description():
    """Sample job description text for testing."""
    return """
    Senior Software Engineer

    We are looking for a Senior Software Engineer with 5+ years of experience
    in Python, TypeScript, and cloud technologies. The ideal candidate will have
    experience with Firebase, AWS, and building scalable web applications.

    Requirements:
    - 5+ years of software engineering experience
    - Strong Python and TypeScript skills
    - Experience with cloud platforms (Firebase, AWS, GCP)
    - Excellent communication skills
    """


@pytest.fixture
def mock_firebase():
    """Mock Firebase initialization to avoid real Firebase calls."""
    with patch("firebase.init_firebase") as mock:
        mock.return_value = None
        yield mock


@pytest.fixture
def mock_firestore_client():
    """Mock Firestore client for database operations."""
    mock_client = Mock()
    mock_collection = Mock()
    mock_document = Mock()

    mock_client.collection.return_value = mock_collection
    mock_collection.document.return_value = mock_document

    with patch("firebase_admin.firestore.client", return_value=mock_client):
        yield mock_client


@pytest.fixture
def mock_storage_bucket():
    """Mock Firebase Storage bucket."""
    mock_bucket = Mock()
    mock_blob = Mock()

    mock_bucket.blob.return_value = mock_blob
    mock_blob.public_url = "https://storage.googleapis.com/test-bucket/test-file.docx"

    with patch("firebase_admin.storage.bucket", return_value=mock_bucket):
        yield mock_bucket


@pytest.fixture
def mock_anthropic_client():
    """Mock Anthropic API client to avoid real API calls."""
    with patch("anthropic.Anthropic") as mock:
        mock_instance = Mock()
        mock.return_value = mock_instance

        mock_response = Mock()
        mock_response.content = [Mock(text="Mock AI response")]
        mock_instance.messages.create.return_value = mock_response

        yield mock_instance


@pytest.fixture
def mock_google_genai():
    """Mock Google GenAI client to avoid real API calls."""
    with patch("google.genai.Client") as mock:
        mock_instance = Mock()
        mock.return_value = mock_instance

        mock_response = Mock()
        mock_response.text = "Mock AI response"
        mock_instance.models.generate_content.return_value = mock_response

        yield mock_instance


@pytest.fixture
def disable_llm_cache(monkeypatch):
    """Disable LLM response caching for tests."""
    monkeypatch.setenv("CACHE_LLM_RESPONSES", "False")
    yield
