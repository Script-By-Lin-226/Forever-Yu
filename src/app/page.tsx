'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [stage, setStage] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: string; duration: string; delay: string }[]>([]);
  const [checkedDislikes, setCheckedDislikes] = useState<boolean[]>([false, false, false, false]);
  const [extraNote, setExtraNote] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (stage === 4) {
      const interval = setInterval(() => {
        setHearts((prev) => [
          ...prev.slice(-20),
          {
            id: Date.now(),
            left: `${Math.random() * 100}%`,
            duration: `${3 + Math.random() * 4}s`,
            delay: `${Math.random() * 2}s`,
          },
        ]);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setHearts([]);
    }
  }, [stage]);

  const photos = [
    '/images/photo_2026-04-17_12-18-06.jpg',
    '/images/photo_2026-04-17_12-18-08.jpg',
    '/images/photo_2026-04-17_12-18-10.jpg',
    '/images/image.png',
    '/images/image copy.png',
    '/images/image copy 2.png',
  ];

  const quizQuestions = [
    {
      question: "What's my favorite thing about you?",
      options: ["Your Smile", "Your Kindness", "Everything", "Your Eyes"],
      answer: "Everything"
    },
    {
      question: "Where was our most memorable moment?",
      options: ["Student Management System Training", "That long walk", "The first time we met", "Every second with you"],
      answer: "Student Management System Training"
    },
    {
      question: "If I could give you anything, what would it be?",
      options: ["The World", "Happiness", "My Whole Heart", "All of the above"],
      answer: "All of the above"
    }
  ];

  const dislikes = [
    "Being ignored when you're talking",
    "Feeling like you're not a priority",
    "Dishonesty, even in small things",
    "Lack of communication during tough times"
  ];

  const nextStage = () => setStage((prev) => prev + 1);
  const prevStage = () => setStage((prev) => prev - 1);

  const handleQuizAnswer = (option: string) => {
    const updated = [...quizAnswers, option];
    setQuizAnswers(updated);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setStage((prev) => prev + 1);
    }
  };

  const toggleDislike = (index: number) => {
    const updated = [...checkedDislikes];
    updated[index] = !updated[index];
    setCheckedDislikes(updated);
  };

  const saveToServer = async () => {
    setIsSaving(true);
    const data = {
      quizAnswers: quizQuestions.map((q, i) => ({
        question: q.question,
        answer: quizAnswers[i] || '',
        correct: q.answer,
      })),
      acknowledgedDislikes: dislikes.filter((_, i) => checkedDislikes[i]),
      extraNote,
    };

    try {
      const response = await fetch('/api/choices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
      console.error('Error saving choice:', error);
      // Fallback to local storage if API fails
      const existing = JSON.parse(localStorage.getItem('surprise_responses') || '[]');
      existing.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem('surprise_responses', JSON.stringify(existing));
    } finally {
      setIsSaving(false);
      setStage((prev) => prev + 1);
    }
  };


  const nextStageWithSave = () => {
    if (stage === 3) {
      saveToServer();
    } else {
      setStage((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="content-wrapper">
        {/* Stage 0: Welcome */}
        {stage === 0 && (
          <div className="text-center fade-in">
            <Heartbeat />
            <h1 className="fancy-title"><span className="premium-gradient-text">Forever Yu</span></h1>
            <p className="description-text mx-auto">
              I've curated this experience to share something that word's alone cannot express. 
              A journey through our shared memories and the professional respect and deep affection I hold for you.
            </p>
            <div className="mt-8 w-full flex justify-center">
              <button onClick={nextStage} className="btn-primary">
                Begin Experience
              </button>
            </div>
          </div>
        )}

        {/* Stage 1: Gallery */}
        {stage === 1 && (
          <div className="fade-in w-full text-center">
            <h2 className="fancy-title">Captured Timelines</h2>
            <p className="description-text mx-auto">Moments that revolve around you, my heart's center.</p>
            
            <div className="gallery-circle-wrapper">
              <div className="central-heart">❤️</div>
              {photos.map((src, index) => (
                <div 
                  key={index} 
                  className={`gallery-circle-item orbit-${index}`}
                >
                  <Image 
                    src={src} 
                    alt={`Archive ${index + 1}`} 
                    width={300} 
                    height={300} 
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 w-full flex flex-row justify-center items-center gap-4">
              <button onClick={prevStage} className="btn-back">
                <span>←</span> Back
              </button>
              <button onClick={nextStage} className="btn-primary">
                Proceed
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Quiz */}
        {stage === 2 && (
          <div className="fade-in w-full max-w-2xl">
            <h2 className="fancy-title">Understanding Check</h2>
            <div className="mb-10">
              <p className="text-2xl font-light mb-10 text-center color-text-light">{quizQuestions[quizStep].question}</p>
              <div className="space-y-4">
                {quizQuestions[quizStep].options.map((option, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuizAnswer(option)}
                    className="quiz-option"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-12 w-full flex flex-row justify-center items-center gap-4">
              <button onClick={prevStage} className="btn-back">
                <span>←</span> Previous
              </button>
              <span className="text-gray-400 text-sm hidden sm:block">Question {quizStep + 1} of {quizQuestions.length}</span>
            </div>
          </div>
        )}

        {/* Stage 3: Dislikes/Understanding */}
        {stage === 3 && (
          <div className="fade-in w-full max-w-3xl">
            <h2 className="fancy-title">Foundations of Respect</h2>
            <p className="description-text mx-auto">Tap each item you acknowledge. Your honesty means the world.</p>
            <div className="flex flex-col items-center">
              <ul className="dislike-list mb-6">
                {dislikes.map((item, index) => (
                  <li 
                    key={index} 
                    className={`dislike-item dislike-clickable fade-in ${checkedDislikes[index] ? 'dislike-checked' : ''}`}
                    style={{animationDelay: `${index * 0.15}s`}}
                    onClick={() => toggleDislike(index)}
                  >
                    <span className="dislike-check">{checkedDislikes[index] ? '✓' : '○'}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full max-w-xl mb-10">
                <p className="text-sm font-semibold text-center" style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Write an extra note (optional)</p>
                <textarea 
                  className="note-input"
                  placeholder="Anything else you'd like me to know..."
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="mt-4 w-full flex flex-row justify-center items-center gap-4">
                <button onClick={prevStage} className="btn-back">
                  <span>←</span> Back
                </button>
                <button 
                  onClick={nextStageWithSave} 
                  className="btn-primary" 
                  disabled={isSaving}
                  style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'wait' : 'pointer' }}
                >
                  {isSaving ? 'Processing...' : 'Final Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Finale */}
        {stage === 4 && (
          <div className="center-content fade-in px-4">
            <EnvelopeAnimation>
              <h2 className="fancy-title" style={{ fontSize: 'var(--fluid-h2)', marginBottom: '1.5rem' }}>Statement of Appreciation</h2>
              <div className="finale-note">
                <p className="font-medium text-rose-500 mb-4">To my most esteemed person Yu ❤️</p>
                <p className="text-sm leading-relaxed text-gray-600 mb-6">
                  This space was created as a testament to the value you bring into my life. 
                  Your perspective, your presence, and the way you navigate the world are inspirations 
                  that I hold in the highest regard.
                </p>
                <p className="text-sm leading-relaxed text-gray-600 mb-8">
                  I am committed to our continued growth, to respecting your boundaries, 
                  and to celebrating the exceptional individual that you are. <br/>
                  <strong>I swear I have only You</strong> and I will always be with you no matter what.
                </p>
                
                <div className="finale-signature mt-12 pt-8 border-t border-rose-100">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Respectfully yours,</p>
                  <p className="font-serif italic text-2xl text-rose-600">Liam</p>
                </div>
              </div>
            </EnvelopeAnimation>
          </div>
        )}
      </div>

    </main>
  );
};

const EnvelopeAnimation = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setShowHearts(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`envelope-wrapper ${isOpen ? 'open' : ''} fade-in-up`}>
      {showHearts && <HeartBurst />}
      <div className="envelope">
        <div className="envelope-flap"></div>
        <div className="envelope-front"></div>
      </div>
      <div className="letter-inner font-serif">
        {children}
      </div>
    </div>
  );
};

const HeartBurst = () => {
  const hearts = Array.from({ length: 20 });
  return (
    <div className="heart-burst-container">
      {hearts.map((_, i) => {
        const angle = (i / 20) * 360;
        const rad = (angle * Math.PI) / 180;
        const distance = 100 + Math.random() * 200;
        const tx = Math.cos(rad) * distance;
        const ty = Math.sin(rad) * distance;
        const scale = 0.5 + Math.random() * 1;
        const rot = Math.random() * 360;
        
        return (
          <div 
            key={i} 
            className="heart-particle"
            style={{ 
              '--tx': `${tx}px`, 
              '--ty': `${ty}px`, 
              '--scale': scale, 
              '--rot': `${rot}deg` 
            } as any}
          >
            ❤️
          </div>
        );
      })}
    </div>
  );
};
const Heartbeat = ({ className = "" }: { className?: string }) => (
  <div className={`heartbeat-container ${className}`}>
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
