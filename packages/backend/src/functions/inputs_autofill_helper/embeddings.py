import os
from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInputList,
    InputList,
)
from functions.inputs_autofill_helper.input_prototype_strings import (
    get_flattened_proto_strings,
)
from google import genai
from dotenv import load_dotenv
import numpy as np

CLASSIFICATION_THRESHOLD = 0.5


def get_client():
    load_dotenv()
    api_key = os.environ.get("GCP_AI_API_KEY")
    client = genai.Client(api_key=api_key)
    return client


def cosine_similarity(vec_1, vec_2):
    return float(np.dot(vec_1, vec_2) / (np.linalg.norm(vec_1) * np.linalg.norm(vec_2)))


def classify_field(
    label_text: str,
    client,
    proto_embeds,
    threshold: float = 0.5,
) -> tuple[str, float] | None:
    """
    Embed the incoming label_text and find the best-matching prototype.
    Returns (best_label, score) if score >= threshold, else None.
    """
    resp = client.models.embed_content(
        model="gemini-embedding-exp-03-07",
        contents=label_text,
        config={
            "outputDimensionality": 768,
            "taskType": "CLASSIFICATION",
        },
    )
    emb = np.array(resp.embeddings[0].values)
    print(emb.shape)

    # Compute cosine similarities
    best_label, best_score = None, -1.0
    for proto_label, proto_vec in proto_embeds.items():
        score = float(
            np.dot(emb, proto_vec) / (np.linalg.norm(emb) * np.linalg.norm(proto_vec))
        )
        if score > best_score:
            best_label, best_score = proto_label, score

    if best_score >= threshold:
        return best_label, best_score
    return None


def embed_content(client, contents):
    return client.models.embed_content(
        model="gemini-embedding-exp-03-07",
        contents=contents,
        config={
            "outputDimensionality": 768,
            "taskType": "CLASSIFICATION",
        },
    )


def get_input_type(client, input_text, prototype_embeds, categories):
    input_raw = embed_content(client, input_text)
    input_embeds = np.array(input_raw.embeddings[0].values)

    # Normalize the prototypes and input embeddings
    prototypes_normalized = prototype_embeds / np.linalg.norm(
        prototype_embeds, axis=1, keepdims=True
    )
    input_normalized = input_embeds / np.linalg.norm(input_embeds)

    similarity_vector = np.dot(prototypes_normalized, input_normalized)
    best_match_label = categories[similarity_vector.argmax()]
    best_match_score = similarity_vector.max()

    return best_match_label, best_match_score


def get_input_classifications(inputs: InputList):
    client = get_client()
    categories, texts = get_flattened_proto_strings()

    prototypes_raw = embed_content(client, texts)
    prototype_embeds = np.stack(
        [np.array(emb.values) for emb in prototypes_raw.embeddings], axis=0
    )

    classified_inputs = []
    for input_item in inputs:
        input_text = input_item.label
        whole_question_label = input_item.wholeQuestionLabel

        best_match, best_score = get_input_type(
            client, input_text, prototype_embeds, categories
        )
        whole_q_best_match, whole_q_score = 0, 0
        if whole_question_label:
            whole_q_best_match, whole_q_score = get_input_type(
                client, whole_question_label, prototype_embeds, categories
            )
            if whole_q_score > best_score:
                best_match, best_score = whole_q_best_match, whole_q_score

        if best_score > CLASSIFICATION_THRESHOLD:
            classified_inputs.append(
                input_item.with_classification(best_match, best_score)
            )
        else:
            classified_inputs.append(input_item.with_classification("unknown", 0))

    return ClassifiedInputList.model_validate(classified_inputs)
