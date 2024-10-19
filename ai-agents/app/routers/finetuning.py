from fastapi import APIRouter, HTTPException
from app.models import Message, FinetuningResponse, CodeGenerationRequest, CodeGenerationResponse
from app.services.data_loader import load_dataset
from app.services.format_validator import validate_format
from app.services.data_analyzer import analyze_dataset
from app.services.cost_estimator import estimate_fine_tuning_cost
from app.services.code_generator import generate_code

router = APIRouter()

@router.post("/generate-response/", response_model=FinetuningResponse)
async def generate_response(message: Message):
    # ... (existing code remains the same)

@router.post("/generate-code/", response_model=CodeGenerationResponse)
async def generate_code_endpoint(request: CodeGenerationRequest):
    try:
        generated_code = generate_code(request.agent, request.prompt)
        return CodeGenerationResponse(generated_code=generated_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))