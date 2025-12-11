import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, AlertCircle, RefreshCcw } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQ = questions[currentQuestionIdx];

  const handleOptionClick = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
    setIsAnswerRevealed(true);
    if (index === currentQ.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(p => p + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto pt-10 text-center animate-slide-up">
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-white">Simulation Complete</h2>
          <div className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {score} / {questions.length}
          </div>
          <p className="text-slate-300 text-lg mb-8">
            {score === questions.length 
              ? "Excellent! You've mastered applying this concept to daily life." 
              : "Good effort! Connecting theory to practice takes practice."}
          </p>
          <button 
            onClick={onComplete}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Explore Another Topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-20 px-4 animate-slide-up">
      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-slate-400">
          Scenario {currentQuestionIdx + 1}/{questions.length}
        </span>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Scenario Header */}
        <div className="bg-indigo-900/30 p-6 border-b border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-1">Daily Encounter</h3>
              <p className="text-lg text-white font-medium">{currentQ.scenario}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center group ";
              
              if (isAnswerRevealed) {
                if (idx === currentQ.correctAnswerIndex) {
                  btnClass += "bg-green-500/20 border-green-500/50 text-white";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-500/20 border-red-500/50 text-slate-300";
                } else {
                  btnClass += "bg-slate-800/50 border-transparent text-slate-500 opacity-50";
                }
              } else {
                btnClass += "bg-slate-800/50 border-transparent hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-200 hover:text-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswerRevealed}
                  className={btnClass}
                >
                  <span className="font-medium text-lg">{option}</span>
                  {isAnswerRevealed && idx === currentQ.correctAnswerIndex && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  {isAnswerRevealed && idx === selectedOption && idx !== currentQ.correctAnswerIndex && (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswerRevealed && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Why this works</h4>
                <p className="text-slate-200 leading-relaxed">
                  {currentQ.realLifeExplanation}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  {currentQuestionIdx < questions.length - 1 ? 'Next Scenario' : 'View Results'}
                  <div className="w-4 h-4">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                     </svg>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
