from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.matcher import matcher

router = APIRouter(prefix="/api/v1/match", tags=["Matching"])

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

class MatchResponse(BaseModel):
    tfidf_score: float
    semantic_score: float
    combined_score: float

@router.post("/", response_model=MatchResponse)
async def analyze_match(payload: MatchRequest):
    if not payload.resume_text.strip() or not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Text inputs cannot be empty.")
    
    tfidf_score = matcher.compute_tfidf_match(payload.resume_text, payload.job_description)
    semantic_score = matcher.compute_semantic_match(payload.resume_text, payload.job_description)
    combined = round((tfidf_score * 0.3) + (semantic_score * 0.7), 2)
    
    return {
        "tfidf_score": tfidf_score,
        "semantic_score": semantic_score,
        "combined_score": combined
    }
