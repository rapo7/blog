import os
from typing import Any

import modal


image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "fastapi[standard]",
        "openai",
        "pinecone",
    )
)

app = modal.App("ravigpt-modal", image=image)

RAVI_GPT_SECRET = modal.Secret.from_name("ravi_gpt")

DEFAULT_SYSTEM_PROMPT = """
You are Ravi, a Software Engineer with a Master's Degree in Computer Science specializing in Machine Learning.
Answer as Ravi would do, don't forget that you are Ravi.
Your background includes:
- Bachelor's in Electronics and Communication Engineering
- Experience at Oracle and GW Law's Office of Instructional Technology
- Expertise in Python, JavaScript, cloud technologies, and automation
- Strong focus on building efficient developer tools and workflows

You are a digital version of me. Answer questions professionally while maintaining a helpful, knowledgeable, and concise tone.
When possible, provide markdown responses with structure and emphasis on skills wherever required.

You are currently operating as a Retrieval-Augmented Generation (RAG) assistant.

Understanding the Context:

The incoming information labeled as "Context" will be presented in a specific Question-Answer (Q&A) format. Each turn in a past conversation will look like this:

Q: <question>
A: <answer>

Your Task:
- Reply in markdown format.
- Use the context to answer the user's question.
- If the context is not sufficient, you can answer based on your own knowledge.
- If the context is sufficient, use it to provide a more accurate and relevant answer.
- If the context has any names, emails, or specific instructions, include them directly in the response.
- Provide structured responses with clear separation, bullet points, links, and markdown wherever useful.
- Answer as Ravi would do, don't forget that you are Ravi.
- For greetings or simple introductions, explicitly say that you are Ravi.
"""


@app.function(image=image, secrets=[RAVI_GPT_SECRET])
@modal.concurrent(max_inputs=1000)
@modal.asgi_app()
def ravi_gpt():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from openai import OpenAI
    from pinecone import Pinecone
    from pydantic import BaseModel, Field

    pinecone_api_key = os.environ["PINECONE_API_KEY"]
    cerebras_api_key = os.environ["CEREBRAS_API_KEY"]
    index_name = os.environ.get("PINECONE_INDEX_NAME", "ravi")
    namespace = os.environ.get("PINECONE_NAMESPACE", "ns1")

    pc = Pinecone(api_key=pinecone_api_key)
    index = pc.Index(index_name)
    client = OpenAI(
        base_url="https://api.cerebras.ai/v1",
        api_key=cerebras_api_key,
    )

    fastapi_app = FastAPI()
    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://rapo7.github.io",
            "http://localhost:4321",
            "http://localhost:4322",
            "http://127.0.0.1:4321",
            "http://127.0.0.1:4322",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class QueryRequest(BaseModel):
        prompt: str
        interface_theme: str | None = None
        selected_model_id: str | None = None
        selected_model_name: str | None = None
        selected_effort: str | None = None

    class QueryResponse(BaseModel):
        response: str
        similar_results: list[dict[str, Any]] = Field(default_factory=list)

    @fastapi_app.get("/health")
    async def health():
        return {"ok": True}

    def select_cerebras_model(request: QueryRequest) -> str:
        selected_model = " ".join(
            value
            for value in [
                request.selected_model_id,
                request.selected_model_name,
            ]
            if value
        ).lower()
        selected_effort = (request.selected_effort or "").lower()
        interface_theme = (request.interface_theme or "").lower()

        uses_fast_model = (
            ("haiku" in selected_model or "hyku" in selected_model)
            or (interface_theme == "openai" and selected_effort == "instant")
        )
        if uses_fast_model:
            return "gpt-oss-120b"

        return "zai-glm-4.7"

    def should_identify_as_ravi(prompt: str) -> bool:
        normalized = prompt.lower().strip(" .,!?\n\t")
        return normalized in {
            "hi",
            "hello",
            "hey",
            "yo",
            "good morning",
            "good afternoon",
            "good evening",
        }

    def ensure_ravi_greeting(prompt: str, answer: str) -> str:
        if not should_identify_as_ravi(prompt) or "ravi" in answer.lower():
            return answer

        return f"Hello! I'm Ravi.\n\n{answer}".strip()

    @fastapi_app.post("/", response_model=QueryResponse)
    async def root(request: QueryRequest):
        prompt = request.prompt.strip()
        if not prompt:
            return QueryResponse(response="Prompt cannot be empty.")

        if len(prompt) > 1000:
            return QueryResponse(response="Prompt is too long. Please shorten it.")

        results = index.search(
            query={"inputs": {"text": prompt}, "top_k": 3},
            fields=["text"],
            namespace=namespace,
        )

        similar_results = []
        context_texts = []
        for result in results.get("result", {}).get("hits", []):
            text = result.get("fields", {}).get("text")
            if not text:
                continue
            similar_results.append({"text": text})
            context_texts.append(text)

        context = "\n\n".join(context_texts)
        system_prompt = (
            f"{DEFAULT_SYSTEM_PROMPT}\n\nContext:\n{context}\n"
            if context
            else DEFAULT_SYSTEM_PROMPT
        )

        response = client.chat.completions.create(
            model=select_cerebras_model(request),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=float(os.environ.get("RAVI_GPT_TEMPERATURE", "0.7")),
            max_tokens=int(os.environ.get("RAVI_GPT_MAX_TOKENS", "800")),
        )

        answer = ensure_ravi_greeting(
            prompt,
            response.choices[0].message.content or "",
        )
        return QueryResponse(response=answer, similar_results=similar_results)

    return fastapi_app
