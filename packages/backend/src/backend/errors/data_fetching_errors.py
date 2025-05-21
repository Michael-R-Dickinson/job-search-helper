class LinkedinError(Exception):
    """Base class for all LinkedIn-related errors."""

    pass


class DescriptionNotFound(LinkedinError):
    """Base class for job description-related errors."""

    pass
