import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState(localStorage.getItem('career_ai_username') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('career_ai_username') || null);
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [interviewDifficulty, setInterviewDifficulty] = useState('Medium');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [ragQuery, setRagQuery] = useState('');
  const [ragResults, setRagResults] = useState([]);
  const [ragLoading, setRagLoading] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      fetchHistory(loggedInUser);
    }
  }, [loggedInUser]);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || (authMode === 'register' && !email.trim())) {
      return alert('Please fill in all required authorization fields.');
    }
    
    const endpoint = authMode === 'register' ? '/api/v1/interview/register' : '/api/v1/interview/login';
    const payload = authMode === 'register' ? { username, email, password } : { username, password };

    try {
      const res = await axios.post(`http://127.0.0.1:8000${endpoint}`, payload);
      localStorage.setItem('career_ai_username', res.data.username);
      setLoggedInUser(res.data.username);
      fetchHistory(res.data.username);
      alert(`Successfully authenticated as ${res.data.username}!`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Authentication failed. Verify credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('career_ai_username');
    setLoggedInUser(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setHistory([]);
    setInterviewQuestions([]);
    alert('Logged out securely.');
  };

  const fetchHistory = async (user) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/interview/history/${user}`);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalysis = async () => {
    if (!file || !jdText) return alert('Please upload a PDF resume and paste a Job Description.');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jdText);

    setLoading(true);
    setInterviewQuestions([]);
    setFeedbackResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/parse/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error processing resume file.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInterview = async () => {
    if (!result) return alert('Please analyze your resume first.');
    if (!loggedInUser) return alert('Secure Authorization Required: Please login or register your profile to track scores.');
    
    setGeneratingQuestions(true);
    setActiveQuestionIndex(0);
    setUserAnswer('');
    setFeedbackResult(null);
    setSecondsElapsed(0);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/interview/generate', {
        target_role: "Software Development Engineer",
        missing_skills: result.gap_analysis?.missing_skills || result.gap_analysis?.missing || [],
        resume_skills: result.resume_skills || [],
        difficulty: interviewDifficulty
      });
      setInterviewQuestions(response.data.questions || []);
      setTimerActive(true);
    } catch (err) {
      alert('Error generating interview session.');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluatingAnswer(true);
    setTimerActive(false);
    try {
      const currentQ = interviewQuestions[activeQuestionIndex];
      const response = await axios.post('http://127.0.0.1:8000/api/v1/interview/evaluate', {
        username: loggedInUser,
        question: currentQ.question,
        user_answer: userAnswer,
        target_role: "Software Development Engineer",
        difficulty: interviewDifficulty,
        time_taken_seconds: secondsElapsed
      });
      setFeedbackResult(response.data);
      fetchHistory(loggedInUser); // Immediately refresh profile score history
    } catch (err) {
      alert('Error evaluating answer.');
    } finally {
      setEvaluatingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setFeedbackResult(null);
    setSecondsElapsed(0);
    if (activeQuestionIndex < interviewQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      alert('Interview session completed! All performance scores are securely saved to your profile.');
      setShowHistoryModal(true);
    }
  };

  const handleRAGSearch = async () => {
    if (!ragQuery.trim()) return;
    setRagLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/rag/retrieve', {
        query: ragQuery,
        top_k: 2
      });
      setRagResults(response.data.retrieved_chunks || []);
    } catch (err) {
      alert('Error querying knowledge base.');
    } finally {
      setRagLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto font-sans">
      {/* Secure Authorization Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            🔒
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Authentication</h2>
            <p className="text-emerald-400 font-extrabold text-base">
              {loggedInUser ? `${loggedInUser} (Authorized & Active)` : 'Access Restricted — Please Login'}
            </p>
          </div>
        </div>

        {!loggedInUser ? (
          <form onSubmit={handleAuth} className="flex flex-wrap gap-2 items-center">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button 
                type="button" 
                onClick={() => setAuthMode('login')} 
                className={`px-3 py-1 rounded-md font-bold transition-all ${authMode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button 
                type="button" 
                onClick={() => setAuthMode('register')} 
                className={`px-3 py-1 rounded-md font-bold transition-all ${authMode === 'register' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Register
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            {authMode === 'register' && (
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            )}
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md">
              {authMode === 'register' ? 'Create Account' : 'Secure Login'}
            </button>
          </form>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setShowHistoryModal(!showHistoryModal)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <span>📊</span> View Score History ({history.length})
            </button>
            <button 
              onClick={handleLogout}
              className="bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Secure Logout
            </button>
          </div>
        )}
      </div>

      <header className="mb-10 text-center border-b border-slate-800/80 pb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
          CareerAI Pro Studio
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Enterprise Technical Interview Copilot • Rigorous Semantic Evaluation • Persistent Secure Profiles
        </p>
      </header>

      {/* Score History Modal / Drawer */}
      {showHistoryModal && (
        <div className="mb-10 bg-slate-900 p-6 rounded-2xl border border-indigo-500/40 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
              <span>📈</span> Secure Performance Profile History for {loggedInUser}
            </h3>
            <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕ Close</button>
          </div>
          {history.length === 0 ? (
            <p className="text-slate-400 text-sm">No evaluation scores recorded yet. Complete an interview session to populate your profile dashboard.</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {history.map((h, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {h.difficulty}
                      </span>
                      <span className="font-semibold text-slate-200">{h.target_role}</span>
                    </div>
                    <p className="text-xs text-slate-400">{h.feedback}</p>
                  </div>
                  <div className="text-right pl-4">
                    <span className="text-xl font-black text-blue-400">{h.score}/100</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{h.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">1. Upload PDF Resume</label>
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-500 cursor-pointer"
          />
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">2. Target Job Description</label>
          <textarea 
            rows="4" 
            value={jdText} 
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste comprehensive Job Description..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={handleAnalysis} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 text-sm"
        >
          {loading ? 'Executing ML Skill Extraction...' : 'Analyze Resume & Skills'}
        </button>
      </div>

      {result && (
        <div className="mt-10 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Resume & Skill Gap Diagnostics</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block uppercase">TF-IDF Overlap</span>
              <span className="text-2xl font-extrabold text-blue-400">{result.tfidf_score}%</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block uppercase">Semantic Match</span>
              <span className="text-2xl font-extrabold text-indigo-400">{result.semantic_score}%</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block uppercase">Combined Score</span>
              <span className="text-3xl font-black text-emerald-400">{result.combined_score}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl">
              <h3 className="font-bold text-emerald-400 text-sm mb-2">Matched Competencies ✅</h3>
              <p className="text-slate-300 text-sm">
                {(result.gap_analysis?.matching_skills || result.gap_analysis?.matched_skills || []).join(', ') || 'None'}
              </p>
            </div>
            <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl">
              <h3 className="font-bold text-rose-400 text-sm mb-2">Identified Skill Gaps ❌</h3>
              <p className="text-slate-300 text-sm">
                {(result.gap_analysis?.missing_skills || result.gap_analysis?.missing || []).join(', ') || 'None'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Interview Rigor Level</label>
              <select 
                value={interviewDifficulty} 
                onChange={(e) => setInterviewDifficulty(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Easy">Easy (Foundational Concepts)</option>
                <option value="Medium">Medium (Production Architecture & Trade-offs)</option>
                <option value="Hard">Hard (Deep Concurrency & Failure Mitigations)</option>
              </select>
            </div>
            <button 
              onClick={handleGenerateInterview}
              disabled={generatingQuestions}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 text-sm"
            >
              {generatingQuestions ? 'Configuring Session...' : 'Start Pro Technical Interview'}
            </button>
          </div>
        </div>
      )}

      {interviewQuestions.length > 0 && (
        <div className="mt-8 bg-slate-900 p-8 rounded-2xl border border-emerald-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <span>🎯</span> Pro Technical Interview Session ({interviewDifficulty})
            </h2>
            <div className="flex items-center gap-4">
              <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-amber-400">
                ⏱️ Elapsed: {Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Question {activeQuestionIndex + 1} of {interviewQuestions.length}
              </span>
            </div>
          </div>

          {(() => {
            const q = interviewQuestions[activeQuestionIndex];
            return (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800 inline-block">
                  {q.category}
                </span>
                <p className="text-slate-100 text-lg font-medium leading-relaxed">{q.question}</p>
                
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Architectural Breakdown:</label>
                  <textarea 
                    rows="6"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Provide professional technical depth covering latency, throughput, concurrency, and trade-offs..."
                    disabled={feedbackResult !== null}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50 font-mono"
                  />
                </div>

                {!feedbackResult ? (
                  <div className="text-right">
                    <button 
                      onClick={handleEvaluateAnswer}
                      disabled={evaluatingAnswer || !userAnswer.trim()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 text-sm shadow-md"
                    >
                      {evaluatingAnswer ? 'Evaluating Technical Rigor...' : 'Submit & Save to Profile'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-400 text-sm uppercase tracking-wider">Evaluation Result</span>
                      <span className={`text-xl font-black ${feedbackResult.score >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Score: {feedbackResult.score}/100
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{feedbackResult.feedback}</p>
                    
                    <div className="text-right pt-2">
                      <button 
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
                      >
                        {activeQuestionIndex < interviewQuestions.length - 1 ? 'Next Question ➔' : 'Complete & View Profile History 🎉'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
