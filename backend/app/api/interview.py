from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import traceback

router = APIRouter(prefix="/api/v1/interview", tags=["Mock Interview"])

class InterviewRequest(BaseModel):
    username: str
    target_role: str
    missing_skills: List[str]

@router.post("/generate-questions")
async def generate_questions(payload: InterviewRequest):
    try:
        skills = payload.missing_skills if payload.missing_skills else ["System Design", "Distributed Systems"]
        
        questions = []
        for skill in skills[:3]:
            questions.append({
                "skill": skill,
                "question": f"Can you explain how you would design or implement a feature using {skill} in a production-grade environment, and what potential bottlenecks you would watch out for?",
                "evaluation_criteria": f"Look for practical experience, understanding of core primitives, scalability considerations, and trade-offs regarding {skill}."
            })

        questions.append({
            "skill": "System Architecture & Trade-offs",
            "question": f"For a high-throughput application targeting the {payload.target_role} position, how would you approach caching and database scaling?",
            "evaluation_criteria": "Look for knowledge of database indexing, caching layers (like Redis), load balancing, and failure handling."
        })

        return {
            "username": payload.username,
            "target_role": payload.target_role,
            "total_questions": len(questions),
            "questions": questions
        }
    except Exception as e:
        print("ERROR IN GENERATE QUESTIONS:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
