from pydantic import RootModel
from nltk.tokenize import TreebankWordTokenizer
from textdistance import sorensen


tokenizer = TreebankWordTokenizer()


class CanonicalOptions(RootModel):
    root: dict[str, list[str]]


# Multiplier for if a comparason string is negated differently than the original.
# ie. a string with the word "not" and a string without it
INCORRECT_NEGATION_PENALTY = 0.4

NEGATION_TOKENS = {"not", "can't", "cannot", "isn't", "aren't"}


# Tokenize into words - we use nltk just to remove contractions and because I have
# more confidence in it than my regex abilities
def tokenize_string(s: str):
    tokens = tokenizer.tokenize(s.lower())
    # drop puncation
    return [t for t in tokens if any(c.isalnum() for c in t)]


def count_negations(tokenized_string: list[str]):
    return sum([s in NEGATION_TOKENS for s in tokenized_string])


def get_similarity(value1: str, value2: str):
    """Gets sorensen similarity but also handles negations (ie not) so that we only say options are similar
    if they're both positive or negative - like "I am authorized" vs "I am not authorized"
    should register as very non-similar"""

    tokenized1, tokenized2 = tokenize_string(value1), tokenize_string(value2)
    negation_equality = (
        count_negations(tokenized1) % 2 == count_negations(tokenized2) % 2
    )

    # Sorensen similarity metric - does a decent job
    score = sorensen.normalized_similarity(tokenized1, tokenized2)
    # print(f"\t {value2} - Score: {score}, negated: {negation_equality}")
    if not negation_equality:
        return score * 0.4

    return score


def get_max_similarity(value, comparason_strings):
    return max([get_similarity(value, s) for s in comparason_strings])


def get_most_similar_canonical_option(value: str, canonical_options: dict):
    """
    Essentially we're trying to figure out which enum value from the schema the field's label maps to. So we
    should identify "I am authorized" as mapping to "us_authorized" from the AuthorizationEnum

    Should be used by category handlers for seeing how close a radio button's label is to the
    canonical options (these are just the enum values for the user autofill data)

    "value" should be the label on a radio button or checkbox
    """
    CanonicalOptions.model_validate(canonical_options)

    max_similarity = -1
    max_similarity_option = None
    for canonical_label, canonical_strings in canonical_options.items():
        # print("Label: ", canonical_label)
        similarity = get_max_similarity(value, canonical_strings)
        # print(f"Max Similarity: {similarity}\n")
        if similarity > max_similarity:
            max_similarity = similarity
            max_similarity_option = canonical_label

    return max_similarity_option


if __name__ == "__main__":
    # Test cases for get_most_similar_canonical_option
    test_options = {
        "us_authorized": [
            "I am authorized to work in the US",
            "I have US work authorization",
            "Legally authorized to work in US",
        ],
        "no_authorization": [
            "I am not authorized to work in the US",
            "I require sponsorship",
            "No US work authorization",
        ],
    }

    # Test similar but not exact matches
    assert (
        get_most_similar_canonical_option(
            "I can legally work in United States", test_options
        )
        == "us_authorized"
    )
    assert (
        get_most_similar_canonical_option(
            "Not authorized for US employment", test_options
        )
        == "no_authorization"
    )

    # # Test handling of negations
    assert (
        get_most_similar_canonical_option(
            "I do not have US work authorization", test_options
        )
        == "no_authorization"
    )
    assert (
        get_most_similar_canonical_option(
            "I am not legally permitted to not work", test_options
        )
        == "us_authorized"
    )

    # # Test with partial matches
    assert (
        get_most_similar_canonical_option("US work permit holder", test_options)
        == "us_authorized"
    )
    assert (
        get_most_similar_canonical_option("Need visa sponsorship", test_options)
        == "no_authorization"
    )

    print("All tests passed!")
