import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConceptView from './components/ConceptView';
import QuizView from './components/QuizView';
import { StudentLevel, AppState, ConceptData } from './types';
import { getConceptDetails, generateConceptImage, generateRealWorldQuiz, generateMoreExperiments } from './services/geminiService';

const App: React.FC = () => {
  const [level, setLevel] = useState<StudentLevel>(StudentLevel.MIDDLE);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentConcept, setCurrentConcept] = useState<ConceptData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConceptSearch = async (topic: string) => {
    setAppState(AppState.SEARCHING);
    setError(null);
    setCurrentConcept(null);

    try {
      // Step 1: Get Text Data (Summary, Experiments, Image Prompt)
      const details = await getConceptDetails(topic, level);
      
      // Initialize concept without image
      const conceptData: ConceptData = {
        ...details,
        diyExperiments: details.diyExperiments || [],
      };
      setCurrentConcept(conceptData);

      // Step 2: Trigger Image Generation in background immediately after text is ready
      generateConceptImage(details.imagePrompt)
        .then((imageUrl) => {
          setCurrentConcept(prev => prev ? { ...prev, visualizationUrl: imageUrl } : null);
        })
        .catch(err => console.error("Image gen failed silently", err));

    } catch (err) {
      console.error("Error fetching concept:", err);
      setError("Failed to generate exhibit. Please try again.");
      setAppState(AppState.IDLE);
    }
  };

  const handleStartQuiz = async () => {
    if (!currentConcept) return;
    setAppState(AppState.LOADING_QUIZ);
    try {
      const quiz = await generateRealWorldQuiz(currentConcept.topic, level);
      setCurrentConcept(prev => prev ? { ...prev, quiz } : null);
      setAppState(AppState.QUIZ_MODE);
    } catch (err) {
      console.error(err);
      // Revert to view mode if quiz generation fails
      setAppState(AppState.SEARCHING); 
    }
  };

  const handleQuizComplete = () => {
    setAppState(AppState.IDLE);
    setCurrentConcept(null);
  };

  const handleLoadMoreExperiments = async () => {
    if (!currentConcept) return;
    const existingTitles = currentConcept.diyExperiments.map(e => e.title);
    const newExperiments = await generateMoreExperiments(currentConcept.topic, level, existingTitles);
    
    setCurrentConcept(prev => {
      if (!prev) return null;
      return {
        ...prev,
        diyExperiments: [...prev.diyExperiments, ...newExperiments]
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Header 
        currentLevel={level} 
        onLevelChange={setLevel} 
        onReset={() => {
          setAppState(AppState.IDLE);
          setCurrentConcept(null);
        }}
        showBack={appState !== AppState.IDLE}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 text-center animate-fade-in">
            {error}
          </div>
        )}

        {appState === AppState.IDLE && (
          <Hero onSearch={handleConceptSearch} isLoading={false} />
        )}

        {appState === AppState.SEARCHING && !currentConcept && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse">
             <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-xl text-indigo-300 font-light">Curating Exhibit...</p>
          </div>
        )}

        {appState === AppState.SEARCHING && currentConcept && (
          <ConceptView 
            data={currentConcept} 
            appState={appState} 
            onStartQuiz={handleStartQuiz}
            onSearch={handleConceptSearch}
            onLoadMoreExperiments={handleLoadMoreExperiments}
          />
        )}

        {appState === AppState.LOADING_QUIZ && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
             <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-xl text-emerald-300 font-light">Preparing Real-World Scenarios...</p>
          </div>
        )}

        {appState === AppState.QUIZ_MODE && currentConcept?.quiz && (
          <QuizView 
            questions={currentConcept.quiz} 
            onComplete={handleQuizComplete} 
          />
        )}
      </main>
    </div>
  );
};

export default App;