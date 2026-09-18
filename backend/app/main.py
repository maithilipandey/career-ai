from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import interview, parser, rag
from app.database import init_db

app = FastAPI(title="CareerAI Pro Studio API", version="2.0")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# Register API Routers
app.include_router(interview.router)
app.include_router(parser.router)
app.include_router(rag.router)

@app.get("/")
def root():
    return {"status": "online", "message": "CareerAI Pro Studio Backend is running successfully."}
