import React, { useState } from 'react';
import { analyzeResume } from '../services/api';

export default function ResumeAnalyzer() {
    const [file, setFile] = useState(null);
    const [jobDesc, setJobDesc] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobDesc) {
            setError('Please provide both a resume file and a job description.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await analyzeResume(file, jobDesc);
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-analyzer-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>AI Resume & Skill-Gap Analysis</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="resume-file" style={{ display: 'block', marginBottom: '5px' }}>Upload Resume (PDF):</label>
                    <input 
                        id="resume-file" 
                        name="resumeFile" 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setFile(e.target.files[0])} 
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="job-desc" style={{ display: 'block', marginBottom: '5px' }}>Job Description:</label>
                    <textarea 
                        id="job-desc" 
                        name="jobDescription" 
                        rows="6"
                        style={{ width: '100%' }}
                        value={jobDesc} 
                        onChange={(e) => setJobDesc(e.target.value)} 
                        placeholder="Paste job description here..."
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
            </form>

            {results && (
                <div className="results-box" style={{ marginTop: '20px', background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
                    <h3>Combined Score: {results.combined_score}%</h3>
                    <p><strong>Matching Skills:</strong> {results.gap_analysis.matching_skills.join(', ')}</p>
                    <p><strong>Missing Skills:</strong> {results.gap_analysis.missing_skills.join(', ')}</p>
                </div>
            )}
        </div>
    );
}
