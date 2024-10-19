from pydantic import BaseModel

class Message(BaseModel):
    text: str

class CodeGenerationRequest(BaseModel):
    agent: str
    prompt: str

class FinetuningResponse(BaseModel):
    agent: str
    num_examples: int
    format_errors: dict
    missing_system: int
    missing_user: int
    num_messages_stats: dict
    total_tokens_stats: dict
    assistant_tokens_stats: dict
    num_truncated: int
    estimated_cost: dict

class CodeGenerationResponse(BaseModel):
    generated_code: str