from fastapi import APIRouter, HTTPException
from app.models import Message, FinetuningResponse
from app.services.data_loader import load_dataset
from app.services.format_validator import validate_format
from app.services.data_analyzer import analyze_dataset
from app.services.cost_estimator import estimate_fine_tuning_cost

router = APIRouter()

@router.post("/generate-response/", response_model=FinetuningResponse)
async def generate_response(message: Message):
    agent_name = message.text  # Assume the message contains the agent name
    data_path = f"data/{agent_name.lower()}_training_data.jsonl"
    
    try:
        dataset = load_dataset(data_path)
        format_errors = validate_format(dataset)
        analysis_results = analyze_dataset(dataset)
        cost_estimate = estimate_fine_tuning_cost(dataset)
        
        return FinetuningResponse(
            agent=agent_name,
            num_examples=len(dataset),
            format_errors=format_errors,
            missing_system=analysis_results['missing_system'],
            missing_user=analysis_results['missing_user'],
            num_messages_stats=analysis_results['num_messages_stats'],
            total_tokens_stats=analysis_results['total_tokens_stats'],
            assistant_tokens_stats=analysis_results['assistant_tokens_stats'],
            num_truncated=analysis_results['num_truncated'],
            estimated_cost=cost_estimate
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Training data for {agent_name} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
