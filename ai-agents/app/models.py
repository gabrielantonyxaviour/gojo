from pydantic import BaseModel
from typing import Optional, List
class Message(BaseModel):
    text: str

class CodeGenerationRequest(BaseModel):
    prompt: str

class CodeGenerationResponse(BaseModel):
    agent: str
    generated_code: str

class FinetuningEstimateResponse(BaseModel):
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

class FineTuningRequest(BaseModel):
    agent: str
    epochs: Optional[int] = None
    learning_rate_multiplier: Optional[float] = None
    batch_size: Optional[int] = None

class FineTuningResponse(BaseModel):
    job_id: str
    status: str
    fine_tuned_model: str | None

class FineTuningJob(BaseModel):
    id: str
    status: str
    fine_tuned_model: Optional[str] = None

class FineTuningEvent(BaseModel):
    id: str
    created_at: int
    level: str
    message: str

class ListJobsResponse(BaseModel):
    jobs: List[FineTuningJob]

class RetrieveJobResponse(BaseModel):
    job: FineTuningJob

class CancelJobResponse(BaseModel):
    job: FineTuningJob

class ListEventsResponse(BaseModel):
    events: List[FineTuningEvent]

class DeleteModelResponse(BaseModel):
    id: str
    deleted: bool