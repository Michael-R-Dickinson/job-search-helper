# Backend Tests

## Running Tests

From the `packages/backend` directory:

```bash
# Run all tests
poetry run pytest

# Run with verbose output
poetry run pytest -v

# Run specific test file
poetry run pytest tests/test_utils.py

# Run specific test class
poetry run pytest tests/test_validation.py::TestLinkedInURLValidation

# Run specific test
poetry run pytest tests/test_utils.py::TestUUIDGeneration::test_generate_uuid_uniqueness

# Run only unit tests
poetry run pytest -m unit

# Run with coverage
poetry run pytest --cov=src --cov-report=term-missing
```

## Test Structure

- `conftest.py` - Shared fixtures for all tests
- `test_utils.py` - Tests for `src/utils.py`
- `test_validation.py` - Tests for `src/functions/validation.py`

## Fixtures

Key fixtures available in all tests (from `conftest.py`):

- `load_env_vars` - Auto-loads .env file (autouse)
- `mock_env_vars` - Override specific env vars
- `test_user_id` - Consistent test user ID
- `sample_job_description` - Sample job posting text
- `mock_firebase` - Mock Firebase initialization
- `mock_firestore_client` - Mock Firestore client
- `mock_storage_bucket` - Mock Firebase Storage
- `mock_anthropic_client` - Mock Anthropic API
- `mock_google_genai` - Mock Google GenAI API
- `disable_llm_cache` - Disable LLM caching

## Writing Tests

Tests should:
- Use the `@pytest.mark.unit` or `@pytest.mark.integration` markers
- Mock external API calls (Firebase, LLM APIs)
- Use provided fixtures to avoid duplication
- Focus on testing business logic, not external services
