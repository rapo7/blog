# Ravi GPT Modal deployment

The deployed app can be disabled by Modal when it was built with an unsupported
client version. Upgrade the local Modal SDK, ensure the secret exists, then
redeploy the ASGI app.

```bash
python3 -m pip install --upgrade modal
modal setup
modal secret create ravi_gpt \
  PINECONE_API_KEY=... \
  CEREBRAS_API_KEY=... \
  PINECONE_INDEX_NAME=ravi \
  PINECONE_NAMESPACE=ns1
modal deploy modal/ravi_gpt.py
```

If `ravi_gpt` already exists, update it in the Modal dashboard or delete
and recreate it before deploying.

Supported Cerebras model IDs for the current key are `gpt-oss-120b` and
`zai-glm-4.7`.

Requests can include chat selection metadata. The app routes Claude Haiku/Hyku
and OpenAI `Instant` effort requests to `gpt-oss-120b`; all other selections use
`zai-glm-4.7` by default.

Run the deployed endpoint tests with:

```bash
python3 -m pip install pytest requests
python3 -m pytest modal/tests
```

Set `RAVI_GPT_URL` to test a different deployment URL.
