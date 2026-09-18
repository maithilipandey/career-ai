import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict

KNOWLEDGE_BASE = [
    {"topic": "System Design", "text": "Caching improves response times by storing copies of frequently accessed data in fast storage like Redis or Memcached."},
    {"topic": "System Design", "text": "Load balancers distribute incoming network traffic across multiple servers using algorithms like Round Robin or Least Connections."},
    {"topic": "Database", "text": "Database indexing speeds up data retrieval operations using B-Trees or Hash Indexes at the cost of additional write overhead."},
    {"topic": "Operating Systems", "text": "Process threads share memory space within the parent process, whereas processes have completely isolated virtual address spaces."},
    {"topic": "Networking", "text": "The TCP 3-way handshake consists of SYN, SYN-ACK, and ACK packets to establish a reliable connection between client and server."},
    {"topic": "Docker", "text": "Docker containers package an application with all its dependencies, running as isolated processes on the host kernel."}
]

class RAGEngine:
    def __init__(self):
        self.encoder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.docs = KNOWLEDGE_BASE
        self._build_index()

    def _build_index(self):
        texts = [doc["text"] for doc in self.docs]
        embeddings = self.encoder.encode(texts, convert_to_numpy=True)
        self.index.add(embeddings.astype('float32'))

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict]:
        query_vector = self.encoder.encode([query], convert_to_numpy=True).astype('float32')
        distances, indices = self.index.search(query_vector, top_k)
        
        results = []
        for idx in indices[0]:
            if idx < len(self.docs):
                results.append(self.docs[idx])
        return results

rag_engine = RAGEngine()
