import React, { useState } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { SAMPLE_TOPICS } from '../constants';

interface HeroProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSearch(input);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-fade-in">
      <div className="mb-8 p-4 bg-indigo-500/10 rounded-full animate-pulse-slow">
        <Lightbulb className="w-12 h-12 text-indigo-400" />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-400 mb-6 tracking-tight">
        Bring Science<br />to Real Life.
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-light">
        Enter a concept from math, physics, or science, and discover how it solves problems in your daily life through AI-powered exhibits.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg relative group z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2">
          <Search className="w-6 h-6 text-slate-500 ml-3" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Gravity, Thermodynamics, Calculus..."
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Explore'}
          </button>
        </div>
      </form>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <span className="text-slate-500 text-sm font-medium w-full mb-2">Popular Exhibits:</span>
        {SAMPLE_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => onSearch(topic)}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm rounded-full border border-white/5 transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
