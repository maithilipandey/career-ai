from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ml.rag_engine import rag_engine

router = APIRouter(prefix="/api/v1/rag", tags=["RAG Retriever"])

class RAGQuery(BaseModel):
    query: str
    top_k: int = 2

class RAGResponse(BaseModel):
    query: str
    retrieved_chunks: List[dict]

@router.post("/retrieve", response_model=RAGResponse)
async def query_knowledge_base(payload: RAGQuery):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    results = rag_engine.retrieve(payload.query, payload.top_k)
    return {
        "query": payload.query,
        "retrieved_chunks": results
    }
