import os
import json
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

CEREBRAS_FREE_TIER_LIMIT_MESSAGE = (
    "Rate limit exceeded on Cerebras free tier.\n\n"
    "Ravi GPT is currently using `gpt-oss-120b` and `zai-glm-4.7`, "
    "which are limited to **5 requests per minute** and **30K tokens per minute** "
    "on the free trial. The quota refills continuously, so wait about "
    "{wait_seconds} seconds and try again."
)

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
    from fastapi import FastAPI, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
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

    def build_greeting_response() -> str:
        return (
            "Hello! I'm Ravi.\n\n"
            "I am a Software Engineer with a Master's degree in Computer Science "
            "specializing in Machine Learning. My background includes experience "
            "at Oracle and GW Law, with expertise in Python, JavaScript, cloud "
            "technologies, automation, and building efficient developer tools.\n\n"
            "How can I help you today?"
        )

    def validate_prompt(prompt: str) -> str | None:
        if not prompt:
            return "Prompt cannot be empty."

        if len(prompt) > 1000:
            return "Prompt is too long. Please shorten it."

        return None

    def search_context(prompt: str) -> tuple[str, list[dict[str, Any]]]:
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

        return "\n\n".join(context_texts), similar_results

    def build_system_prompt(context: str) -> str:
        return (
            f"{DEFAULT_SYSTEM_PROMPT}\n\nContext:\n{context}\n"
            if context
            else DEFAULT_SYSTEM_PROMPT
        )

    def completion_params(
        request: QueryRequest,
        system_prompt: str,
    ) -> dict[str, Any]:
        return {
            "model": select_cerebras_model(request),
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt.strip()},
            ],
            "temperature": float(os.environ.get("RAVI_GPT_TEMPERATURE", "0.7")),
            "max_tokens": int(os.environ.get("RAVI_GPT_MAX_TOKENS", "800")),
        }

    def get_delta_text(chunk: Any) -> str:
        choices = getattr(chunk, "choices", None) or []
        if not choices:
            return ""

        delta = getattr(choices[0], "delta", None)
        return getattr(delta, "content", None) or ""

    def iter_text_chunks(text: str, chunk_size: int = 18):
        for index in range(0, len(text), chunk_size):
            yield text[index : index + chunk_size]

    def is_rate_limit_error(error: Exception) -> bool:
        if getattr(error, "status_code", None) == 429:
            return True

        error_text = str(error).lower()
        return any(
            marker in error_text
            for marker in [
                "rate limit",
                "too_many_requests",
                "too many requests",
                "queue_exceeded",
            ]
        )

    def get_rate_limit_wait_seconds(error: Exception) -> int:
        headers = getattr(error, "headers", None)
        response = getattr(error, "response", None)
        if headers is None and response is not None:
            headers = getattr(response, "headers", None)

        for header in [
            "retry-after",
            "x-ratelimit-reset-requests-minute",
            "x-ratelimit-reset-tokens-minute",
        ]:
            try:
                value = headers.get(header) if headers else None
            except AttributeError:
                value = None

            if not value:
                continue

            try:
                return max(1, int(float(value)))
            except ValueError:
                continue

        return 60

    def build_rate_limit_message(error: Exception) -> str:
        return CEREBRAS_FREE_TIER_LIMIT_MESSAGE.format(
            wait_seconds=get_rate_limit_wait_seconds(error),
        )

    def stream_headers() -> dict[str, str]:
        return {
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        }

    async def parse_stream_request(raw_request: Request) -> QueryRequest:
        content_type = raw_request.headers.get("content-type", "")

        if "application/json" in content_type:
            return QueryRequest.model_validate(await raw_request.json())

        raw_body = (await raw_request.body()).decode("utf-8").strip()
        if not raw_body:
            return QueryRequest(prompt="")

        try:
            payload = json.loads(raw_body)
        except json.JSONDecodeError:
            payload = {"prompt": raw_body}

        return QueryRequest.model_validate(payload)

    @fastapi_app.post("/", response_model=QueryResponse)
    async def root(request: QueryRequest):
        prompt = request.prompt.strip()
        validation_error = validate_prompt(prompt)
        if validation_error:
            return QueryResponse(response=validation_error)

        if should_identify_as_ravi(prompt):
            return QueryResponse(response=build_greeting_response())

        context, similar_results = search_context(prompt)
        system_prompt = build_system_prompt(context)
        try:
            response = client.chat.completions.create(
                **completion_params(request, system_prompt),
            )
        except Exception as error:
            if is_rate_limit_error(error):
                return QueryResponse(response=build_rate_limit_message(error))
            raise

        answer = ensure_ravi_greeting(
            prompt,
            response.choices[0].message.content or "",
        )
        return QueryResponse(response=answer, similar_results=similar_results)

    @fastapi_app.post("/stream")
    async def stream(raw_request: Request):
        request = await parse_stream_request(raw_request)
        prompt = request.prompt.strip()
        validation_error = validate_prompt(prompt)
        if validation_error:
            return StreamingResponse(
                iter([validation_error]),
                media_type="text/plain; charset=utf-8",
                headers=stream_headers(),
            )

        if should_identify_as_ravi(prompt):
            return StreamingResponse(
                iter_text_chunks(build_greeting_response()),
                media_type="text/plain; charset=utf-8",
                headers=stream_headers(),
            )

        context, _similar_results = search_context(prompt)
        system_prompt = build_system_prompt(context)

        def generate():
            try:
                params = completion_params(request, system_prompt)
                response_stream = client.chat.completions.create(
                    **params,
                    stream=True,
                )
                streamed_text = ""

                for chunk in response_stream:
                    text = get_delta_text(chunk)
                    if text:
                        streamed_text += text
                        yield text

                if not streamed_text.strip():
                    fallback_params = params
                    if params.get("model") != "gpt-oss-120b":
                        fallback_params = {**params, "model": "gpt-oss-120b"}

                    fallback_stream = client.chat.completions.create(
                        **fallback_params,
                        stream=True,
                    )
                    fallback_streamed_text = ""
                    for chunk in fallback_stream:
                        text = get_delta_text(chunk)
                        if text:
                            fallback_streamed_text += text
                            yield text

                    if fallback_streamed_text.strip():
                        return

                    fallback_response = client.chat.completions.create(**fallback_params)
                    fallback_text = fallback_response.choices[0].message.content or ""
                    if not fallback_text.strip():
                        yield "Ravi GPT returned an empty model response. Please try again."
                        return
                    if not should_identify_as_ravi(prompt):
                        fallback_text = ensure_ravi_greeting(prompt, fallback_text)
                    for text_chunk in iter_text_chunks(fallback_text):
                        yield text_chunk
            except Exception as error:
                if is_rate_limit_error(error):
                    yield build_rate_limit_message(error)
                    return

                yield "Ravi GPT hit an unexpected response error. Please try again."

        return StreamingResponse(
            generate(),
            media_type="text/plain; charset=utf-8",
            headers=stream_headers(),
        )

    return fastapi_app
