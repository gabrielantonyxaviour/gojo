import os
from dotenv import load_dotenv
from dstack_sdk import AsyncTappdClient, DeriveKeyResponse, TdxQuoteResponse
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()
# endpoint = '../../tappd.sock'
endpoint = 'http://host.docker.internal:8090'

class Message(BaseModel):
    text: str

@app.get("/")
async def root():
    client = AsyncTappdClient()
    deriveKey = await client.derive_key('/', 'test')
    assert isinstance(deriveKey, DeriveKeyResponse)
    asBytes = deriveKey.toBytes()
    assert isinstance(asBytes, bytes)
    limitedSize = deriveKey.toBytes(32)
    tdxQuote = await client.tdx_quote('test')
    return {"deriveKey": asBytes.hex(), "derive_32bytes": limitedSize.hex(), "tdxQuote": tdxQuote}

@app.post("/chat/")
async def chat(message: Message):
    response = generate_response(message.text)
    return {"response": response}
    
def generate_response(user_input: str) -> str:
    # Use OpenAI GPT model for chatbot response, or return a placeholder response
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "user",
                    "content": user_input  # Use the user_input variable instead
                }
            ]
        )
        # Access the content of the message using the .content attribute
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating response: {str(e)}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
