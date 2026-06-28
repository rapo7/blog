import os

import pytest
import requests


RAVI_GPT_URL = os.environ.get(
    "RAVI_GPT_URL",
    "https://ravitejarapolu6--ravigpt-modal-ravi-gpt.modal.run",
)


def post_prompt(payload: dict[str, str]) -> dict:
    response = requests.post(RAVI_GPT_URL, json=payload, timeout=45)
    assert response.status_code == 200, response.text

    data = response.json()
    assert isinstance(data.get("response"), str)
    assert data["response"].strip()
    assert isinstance(data.get("similar_results"), list)
    return data


@pytest.mark.parametrize(
    "payload",
    [
        {
            "prompt": "hello",
            "interface_theme": "anthropic",
            "selected_model_id": "haiku",
            "selected_model_name": "Ravi Hyku 4.5",
            "selected_effort": "Low",
        },
        {
            "prompt": "hello",
            "interface_theme": "openai",
            "selected_model_id": "5.5",
            "selected_model_name": "5.5",
            "selected_effort": "Instant",
        },
    ],
)
def test_fast_model_hello_identifies_as_ravi(payload: dict[str, str]):
    data = post_prompt(payload)

    assert "ravi" in data["response"].lower()


def test_rag_contact_question_returns_contact_context():
    data = post_prompt(
        {
            "prompt": "How can I contact you?",
            "interface_theme": "anthropic",
            "selected_model_id": "opus",
            "selected_model_name": "Ravi Ohpus 4.8",
            "selected_effort": "High",
        },
    )

    combined_text = " ".join(
        [data["response"]]
        + [result.get("text", "") for result in data["similar_results"]]
    ).lower()
    assert any(
        token in combined_text
        for token in ["linkedin", "email", "contact", "reach"]
    )
