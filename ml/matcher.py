from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

class CareerMatcher:
    def __init__(self):
        self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    def compute_tfidf_match(self, resume_text: str, jd_text: str) -> float:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return round(float(similarity) * 100, 2)

    def compute_semantic_match(self, resume_text: str, jd_text: str) -> float:
        emb_resume = self.embedding_model.encode(resume_text, convert_to_tensor=True)
        emb_jd = self.embedding_model.encode(jd_text, convert_to_tensor=True)
        similarity = util.cos_sim(emb_resume, emb_jd).item()
        return round(float(similarity) * 100, 2)

matcher = CareerMatcher()
