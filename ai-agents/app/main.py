from fastapi import FastAPI
from app.routers import finetuning

app = FastAPI()

app.include_router(finetuning.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Agent Fine-tuning API"}
