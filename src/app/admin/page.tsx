'use client';

import { useState, useEffect } from 'react';

interface Response {
  id: number;
  timestamp: string;
  quizAnswers: { question: string; answer: string; correct: string }[];
  acknowledgedDislikes: string[];
  extraNote: string;
}

const Heartbeat = () => (
  <div className="heartbeat-container scale-75">
    <div className="heartbeat-inner">
      <div className="heartbeat-ripple"></div>
      <div className="heartbeat-ripple"></div>
      <div className="heartbeat-ripple"></div>
      <div className="heartbeat-main">❤️</div>
    </div>
    <div className="ecg-container h-[40px] mt-4">
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full opacity-60">
        <path 
          className="ecg-line" 
          d="M0,50 L200,50 L220,50 L240,10 L260,90 L280,50 L300,50 L500,50 L520,50 L540,10 L560,90 L580,50 L600,50 L800,50 L820,50 L840,10 L860,90 L880,50 L1000,50" 
        />
      </svg>
    </div>
  </div>
);

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
    <div className="admin-letter-theme pb-32 min-h-screen">
      <main className="max-w-4xl mx-auto px-6 pt-20">
        
        <div className="text-center mb-16 fade-in px-4">
          <h1 className="fancy-title" style={{ fontSize: 'var(--fluid-h1)', color: 'var(--letter-accent)', letterSpacing: '-0.02em' }}>The Collector's Archive</h1>
          <p className="description-text mx-auto italic opacity-60 mt-4 max-w-xl">
            Letters chronologically arranged from your shared eternity. Every choice and every note preserved here.
          </p>
          
          {responses.length > 0 && (
            <div className="mt-10 flex justify-center gap-4">
              <button onClick={clearAll} className="admin-letter-btn btn-letter-outline">
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="center-content-y px-2 md:px-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 fade-in">
              <Heartbeat />
              <p className="text-rose-400 font-bold tracking-widest uppercase text-[10px] mt-6">Unfolding letters...</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 fade-in">
              <Heartbeat />
              <p className="text-gray-400 mt-10 italic text-lg text-center leading-relaxed">
                Every heartbeat is a silent message...<br/>
                <span className="text-sm opacity-60">Wait for someone to walk through the journey you created.</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 md:gap-20 fade-in mt-16 max-w-5xl mx-auto">
              {responses.map((res, idx) => (
              <div key={res.id} className="response-letter-card fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="wax-seal-badge">
                  <span className="opacity-80">❤️</span>
                </div>
                
                <div className="flex justify-between items-baseline mb-8">
                  <h3 className="admin-letter-title w-full">Letter #{res.id}</h3>
                  <span className="letter-timestamp text-right min-w-[150px]">
                    {new Date(res.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.2em] mb-4">Section I: Understanding</h4>
                    <div className="space-y-4">
                      {res.quizAnswers.map((qa, i) => (
                        <div key={i} className="admin-letter-section">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{qa.question}</p>
                          <p className={`text-sm font-semibold truncate ${qa.answer === qa.correct ? 'text-green-600' : 'text-rose-500'}`}>
                            {qa.answer || 'No selection'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.2em] mb-4">Section II: Respect</h4>
                      <div className="flex flex-wrap gap-2">
                        {res.acknowledgedDislikes.length > 0 ? (
                          res.acknowledgedDislikes.map((d, i) => (
                            <span key={i} className="text-[11px] font-medium border border-rose-100 px-3 py-1.5 rounded-sm bg-rose-50/20 text-rose-500">
                              ✓ {d}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm italic text-gray-300">No boundaries marked.</p>
                        )}
                      </div>
                    </div>

                    {res.extraNote && (
                      <div className="space-y-4 pt-6 border-t border-dashed border-gray-100">
                        <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.2em] mb-4">Section III: Message</h4>
                        <p className="text-sm italic text-gray-600 leading-relaxed font-serif bg-yellow-50/10 p-4 rounded-lg border-l-2 border-rose-200">
                          "{res.extraNote}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => deleteResponse(res.id)}
                    className="admin-letter-btn btn-letter-primary"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </main>
    </div>
  );
}

