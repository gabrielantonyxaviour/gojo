import openai
import os

# Ensure you have set the OPENAI_API_KEY environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_code(agent: str, prompt: str) -> str:
    # You would replace these with your actual fine-tuned model names
    model_map = {
        "layerzero": "ft:gpt-3.5-turbo-0613:personal::7qTnJaHS",
        "fhenix": "ft:gpt-3.5-turbo-0613:personal::7r2nMopE",
        "sign_protocol": "ft:gpt-3.5-turbo-0613:personal::7s8vGVx0"
    }
    
    model = model_map.get(agent.lower())
    if not model:
        raise ValueError(f"No fine-tuned model found for agent: {agent}")

    messages = [
        {"role": "system", "content": f"You are an AI assistant specialized in {agent}. Generate code based on the user's prompt."},
        {"role": "user", "content": prompt}
    ]

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.7,
    )

    return response.choices[0].message['content'].strip()