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

  const saveToStorage = () => {
    const data = {
      timestamp: new Date().toISOString(),
      quizAnswers: quizQuestions.map((q, i) => ({
        question: q.question,
        answer: quizAnswers[i] || '',
        correct: q.answer,
      })),
      acknowledgedDislikes: dislikes.filter((_, i) => checkedDislikes[i]),
      extraNote,
    };
    
    const existing = JSON.parse(localStorage.getItem('surprise_responses') || '[]');
    existing.push(data);
    localStorage.setItem('surprise_responses', JSON.stringify(existing));
  };

  const nextStageWithSave = () => {
    if (stage === 3) {
      saveToStorage();
    }
    setStage((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen">
      <div className="content-wrapper">
        {/* Stage 0: Welcome */}
        {stage === 0 && (
          <div className="text-center fade-in">
            <h1 className="fancy-title">Forever Yu</h1>
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
          <div className="fade-in w-full max-w-3xl text-center relative">
            {hearts.map((heart) => (
              <span 
                key={heart.id} 
                className="falling-heart" 
                style={{ left: heart.left, animationDuration: heart.duration, animationDelay: heart.delay }}
              >
                ❤️
              </span>
            ))}
            <h2 className="fancy-title">Statement of Appreciation</h2>
            <div className="finale-note text-center">
              <p>To my most esteemed person,</p>
              <br/>
              <p>
                This space was created as a testament to the value you bring into my life. 
                Your perspective, your presence, and the way you navigate the world are inspirations 
                that I hold in the highest regard.
              </p>
              <br/>
              <p>
                I am committed to our continued growth, to respecting your boundaries, 
                and to celebrating the exceptional individual that you are.
              </p>
              
              <div className="finale-signature mt-12 text-left">
                <p className="finale-title-text">Respectfully yours,</p>
                <p className="finale-name-text">Liam</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
