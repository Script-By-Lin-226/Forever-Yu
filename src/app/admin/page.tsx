'use client';

import { useState, useEffect } from 'react';

interface Response {
  id: number;
  timestamp: string;
  quizAnswers: { question: string; answer: string; correct: string }[];
  acknowledgedDislikes: string[];
  extraNote: string;
}

export default function AdminPanel() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/choices');
      const data = await response.json();
      setResponses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResponse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this response?')) return;
    try {
      const response = await fetch(`/api/choices?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setResponses(responses.filter(res => res.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete response:', error);
    }
  };

  const clearAll = async () => {
    if (!confirm('Are you sure you want to clear all data?')) return;
    try {
      await fetch('/api/choices', { method: 'DELETE' });
      setResponses([]);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };

  return (
    <main className="min-h-screen pb-20" style={{ background: '#f8f9fa' }}>
      <div className="content-wrapper" style={{ maxWidth: '900px' }}>
        <h1 className="fancy-title" style={{ fontSize: '2.5rem' }}>Admin Panel</h1>
        <p className="description-text mx-auto">All responses collected from the surprise experience.</p>

        {loading ? (
          <div className="text-center py-10" style={{ color: '#999' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-10" style={{ color: '#999' }}>
            <p style={{ fontSize: '1.2rem' }}>No responses yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Responses will appear here once someone completes the experience.</p>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-between items-center mb-8 px-4">
              <span className="text-sm font-medium text-gray-500">Total: {responses.length}</span>
              <button onClick={clearAll} className="btn-back" style={{ borderColor: '#e74c3c', color: '#e74c3c', padding: '8px 16px', fontSize: '0.9rem' }}>
                Clear All Data
              </button>
            </div>

            <div className="space-y-6">
              {responses.map((res, idx) => (
                <div key={res.id} className="admin-card relative group">
                  <button 
                    onClick={() => deleteResponse(res.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete response"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>

                  <div className="admin-card-header">
                    <span className="admin-badge">Response #{res.id}</span>
                    <span className="admin-date">{new Date(res.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="admin-section">
                    <h3 className="admin-section-title">Quiz Answers</h3>
                    {res.quizAnswers.map((qa, i) => (
                      <div key={i} className="admin-row">
                        <p className="admin-question">{qa.question}</p>
                        <div className="admin-answer-row">
                          <span className={`admin-answer ${qa.answer === qa.correct ? 'admin-correct' : 'admin-wrong'}`}>
                            {qa.answer || '—'}
                          </span>
                          {qa.answer !== qa.correct && (
                            <span className="admin-correct-label">Correct: {qa.correct}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-section">
                    <h3 className="admin-section-title">Acknowledged Items</h3>
                    {res.acknowledgedDislikes.length > 0 ? (
                      <ul className="admin-list">
                        {res.acknowledgedDislikes.map((d, i) => (
                          <li key={i} className="admin-list-item">✓ {d}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="admin-empty">None acknowledged</p>
                    )}
                  </div>

                  {res.extraNote && (
                    <div className="admin-section">
                      <h3 className="admin-section-title">Extra Note</h3>
                      <div className="admin-note">{res.extraNote}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
