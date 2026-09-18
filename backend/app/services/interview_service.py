import json
from typing import List, Dict

class InterviewService:
    def generate_questions(self, target_role: str, missing_skills: List[str], resume_skills: List[str]) -> List[Dict]:
        """
        Generates targeted technical interview questions based on missing skills and resume gaps.
        Fallback structured output provided for zero-API latency / offline dev mode.
        """
        primary_focus = missing_skills[:3] if missing_skills else ["General CS Fundamentals"]
        
        questions = []
        for i, skill in enumerate(primary_focus, 1):
            questions.append({
                "id": i,
                "category": skill,
                "question": f"In {target_role} roles, handling {skill} effectively is critical. Can you explain a core concept or design pattern associated with {skill} and how you'd apply it in production?",
                "follow_up": f"What are common edge cases or performance bottlenecks when working with {skill}?",
                "key_concepts": [f"{skill} fundamentals", "Optimization", "Trade-offs"]
            })
            
        return questions

interview_service = InterviewService()
