from collections import defaultdict
import os
import time
from typing import Optional, cast
from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInputList,
    Input,
    InputList,
    ListModel,
)
from functions.inputs_autofill_helper.input_prototype_strings import (
    get_flattened_proto_strings,
    InputType,
)
from google import genai
from dotenv import load_dotenv
import numpy as np
from pydantic import BaseModel, ConfigDict, field_validator
from utils import timer

from functools import lru_cache

from firebase.buckets import (
    cache_prototype_embeds_to_storage,
    get_cached_prototype_embeds_from_storage,
)

CLASSIFICATION_THRESHOLD = 0.8


class InputWithEmbed(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    input_item: Input
    label_embed: np.ndarray
    whole_question_embed: Optional[np.ndarray] = None

    @field_validator("whole_question_embed", "label_embed")
    def ensure_ndarray(cls, v):
        if isinstance(v, np.ndarray):
            return v
        raise ValueError("embeds must be a numpy array")


class InputWithEmbedList(ListModel):
    root: list[InputWithEmbed]


@lru_cache(maxsize=1)
def get_stored_prototype_embeddings():
    loaded_embed_data = get_cached_prototype_embeds_from_storage()
    if loaded_embed_data:
        print(
            f"Retrieved cached prototype embeddings from storage: {len(loaded_embed_data[0])} embeddings"
        )
        return loaded_embed_data

    print("No cached prototype embeddings found - generating new ones (slowly)")
    embed_categories, prototype_embeds = generate_prototype_embeds()
    cache_prototype_embeds_to_storage(embed_categories, prototype_embeds)

    print(embed_categories, prototype_embeds)
    return embed_categories, prototype_embeds


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
        return cast(str, best_label), best_score

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


def get_input_type(input_embeds, prototype_embeds, categories):
    # Normalize the prototypes and input embeddings
    prototypes_normalized = prototype_embeds / np.linalg.norm(
        prototype_embeds, axis=1, keepdims=True
    )
    input_normalized = input_embeds / np.linalg.norm(input_embeds)

    similarity_vector = np.dot(prototypes_normalized, input_normalized)
    best_match_label = categories[similarity_vector.argmax()]
    best_match_score = similarity_vector.max()

    return best_match_label, best_match_score


def generate_prototype_embeds():
    print("Computing new prototype embeddings")
    client = get_client()
    embed_categories, texts = get_flattened_proto_strings()

    # Process embeddings in batches of 100
    batch_size = 50
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i : i + batch_size]
        print(
            f"Processing embedding batch {i//batch_size + 1}/{(len(texts) + batch_size - 1)//batch_size}"
        )

        batch_embeds = embed_content(client, batch_texts)
        all_embeddings.extend(batch_embeds.embeddings)

        # Wait to avoid rate limiting
        if i < len(texts) - batch_size:
            print("Sleeping for 120 seconds")
            time.sleep(120)

    prototype_embeds = np.stack(
        [np.array(emb.values) for emb in all_embeddings], axis=0
    )
    return embed_categories, prototype_embeds


def get_input_embeds(client, inputs: InputList) -> InputWithEmbedList:
    flat_inputs = []
    for input_data in inputs:
        flat_inputs.append(
            {
                "id": input_data.id,
                "text": input_data.label,
                "input_item": input_data,
                "type": "label",
            }
        )
        if input_data.wholeQuestionLabel:
            flat_inputs.append(
                {
                    "id": input_data.id,
                    "text": input_data.wholeQuestionLabel,
                    "input_item": input_data,
                    "type": "whole_question_label",
                }
            )
    flat_input_texts = [input["text"] for input in flat_inputs]
    raw_embeds = embed_content(client, flat_input_texts).embeddings
    embed_values = [np.array(emb.values) for emb in raw_embeds]

    inputs_with_embeds_map: dict = defaultdict(lambda: {})
    for input_data, embed_value in zip(flat_inputs, embed_values):
        input_id = input_data["id"]
        updated_item = inputs_with_embeds_map[input_id]
        updated_item["input_item"] = input_data["input_item"]

        if input_data["type"] == "label":
            updated_item["label_embed"] = embed_value
        elif input_data["type"] == "whole_question_label":
            updated_item["whole_question_embed"] = embed_value

    inputs_with_embeds = list(inputs_with_embeds_map.values())

    return InputWithEmbedList.model_validate(inputs_with_embeds)


@timer
def get_input_classifications(inputs: InputList):
    client = get_client()
    # The two lists are one for one - each prototype_embed[i] is of category embed_categories[i]
    embed_categories, prototype_embeds = get_stored_prototype_embeddings()
    inputs_with_embeds = get_input_embeds(client, inputs)

    classified_inputs = []
    for input_with_embed in inputs_with_embeds:
        input_item = input_with_embed.input_item
        label_embed = input_with_embed.label_embed
        whole_question_embed = input_with_embed.whole_question_embed

        input_type, score = get_input_type(
            label_embed, prototype_embeds, embed_categories
        )

        if whole_question_embed is not None:
            whole_q_input_type, whole_q_score = get_input_type(
                whole_question_embed, prototype_embeds, embed_categories
            )
            if whole_q_score > score:
                input_type, score = whole_q_input_type, whole_q_score

        if score > CLASSIFICATION_THRESHOLD:
            classified_inputs.append(input_item.with_category(input_type, score))
        else:
            classified_inputs.append(input_item.with_category(InputType.UNKNOWN, 0))

    return ClassifiedInputList.model_validate(classified_inputs)
