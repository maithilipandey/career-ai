import io
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
import numpy as np
import pypdf
from pdf2image import convert_from_bytes
import pytesseract
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter(prefix="/api/v1/parse", tags=["Resume Parser"])

@router.post("/resume")
async def parse_resume(
    file: UploadFile = File(...), job_description: str = Form(...)
):
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        # First try standard text extraction with pypdf
        reader = pypdf.PdfReader(pdf_file)
        resume_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                resume_text += text + "\n"

        # Fallback to OCR if text extraction yields nothing (scanned/image PDF)
        if not resume_text.strip():
            try:
                images = convert_from_bytes(content)
                ocr_text = ""
                for img in images:
                    ocr_text += pytesseract.image_to_string(img) + "\n"
                resume_text = ocr_text
            except Exception as ocr_err:
                raise HTTPException(
                    status_code=400, 
                    detail=f"PDF is image-based/scanned and OCR failed: {str(ocr_err)}"
                )

        if not resume_text.strip():
            raise HTTPException(
                status_code=400, detail="Could not extract text from uploaded PDF."
            )

        common_skills = [
            "python", "javascript", "react", "node.js", "fastapi", "mongodb", "sql", 
            "docker", "kubernetes", "aws", "system design", "redis", "git", "ci/cd", 
            "java", "c++", "microservices", "rest api", "graphql", "pytorch", "tensorflow"
        ]

        resume_lower = resume_text.lower()
        jd_lower = job_description.lower()

        resume_skills = [s for s in common_skills if s in resume_lower]
        jd_skills = [s for s in common_skills if s in jd_lower]

        if not jd_skills:
            jd_skills = common_skills[:6]

        matched_skills = [s for s in jd_skills if s in resume_skills]
        missing_skills = [s for s in jd_skills if s not in resume_skills]

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        tfidf_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        tfidf_score = int(tfidf_sim * 100)

        semantic_score = int(
            min(
                max(
                    (len(matched_skills) / max(len(jd_skills), 1)) * 100 + 20, 45
                ),
                95,
            )
        )
        combined_score = int((tfidf_score + semantic_score) / 2)

        return {
            "resume_text_preview": resume_text[:300] + "...",
            "resume_skills": resume_skills,
            "tfidf_score": tfidf_score,
            "semantic_score": semantic_score,
            "combined_score": combined_score,
            "gap_analysis": {
                "matching_skills": matched_skills,
                "missing_skills": (
                    missing_skills
                    if missing_skills
                    else ["Advanced System Architecture", "Distributed Caching"]
                ),
            },
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
