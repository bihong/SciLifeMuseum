import React from 'react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { StudentLevel } from '../types';
import { LEVELS } from '../constants';

interface HeaderProps {
  currentLevel: StudentLevel;
  onLevelChange: (level: StudentLevel) => void;
  onReset: () => void;
  showBack: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentLevel, onLevelChange, onReset, showBack }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {showBack && (
              <button 
                onClick={onReset}
                className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Go home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div 
              onClick={onReset} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                SciLife<span className="font-light text-slate-400">Museum</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="level-select" className="text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:block">
              Difficulty:
            </label>
            <div className="relative">
              <select
                id="level-select"
                value={currentLevel}
                onChange={(e) => onLevelChange(e.target.value as StudentLevel)}
                className="appearance-none bg-slate-800 text-sm text-white pl-4 pr-10 py-2 rounded-lg border border-slate-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
