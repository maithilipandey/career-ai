import re
from typing import List, Set

SKILL_DB = {
    "python", "javascript", "react", "node.js", "express", "mongodb", "postgresql",
    "sql", "fastapi", "flask", "docker", "kubernetes", "aws", "azure", "gcp",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow",
    "pytorch", "scikit-learn", "data structures", "algorithms", "c++", "java",
    "html", "css", "git", "rest api", "graphql", "system design", "operating systems",
    "computer networks", "dbms", "rag", "langchain", "llm", "transformers"
}

class SkillExtractor:
    def __init__(self, skill_database: Set[str] = None):
        self.skill_db = skill_database or SKILL_DB

    def extract_skills(self, text: str) -> List[str]:
        text_clean = text.lower()
        extracted = set()
        
        for skill in self.skill_db:
            # Match whole words/phrases using boundary checks
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_clean):
                extracted.add(skill.title() if len(skill) > 3 else skill.upper())
                
        return sorted(list(extracted))

    def analyze_gap(self, resume_skills: List[str], jd_skills: List[str]):
        resume_set = set(s.lower() for s in resume_skills)
        jd_set = set(s.lower() for s in jd_skills)
        
        matching = [s.title() for s in jd_set.intersection(resume_set)]
        missing = [s.title() for s in jd_set.difference(resume_set)]
        
        return {
            "matching_skills": matching,
            "missing_skills": missing,
            "gap_count": len(missing)
        }

extractor = SkillExtractor()
