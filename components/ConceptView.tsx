import React, { useState } from 'react';
import { ConceptData, AppState, DIYExperiment } from '../types';
import { Beaker, BrainCircuit, Sparkles, ArrowRight, Clock, CheckCircle2, Play, Youtube, Loader2, Cpu, ExternalLink, ChevronDown, ChevronUp, BookOpen, Sigma, Search, X } from 'lucide-react';
import { generateExperimentVideo } from '../services/geminiService';

interface ConceptViewProps {
  data: ConceptData;
  appState: AppState;
  onStartQuiz: () => void;
  onSearch: (topic: string) => void;
  onLoadMoreExperiments: () => Promise<void>;
}

const ExperimentCard: React.FC<{ experiment: DIYExperiment, index: number }> = ({ experiment, index }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAiSim, setShowAiSim] = useState(false);

  const handleGenerateVideo = async () => {
    setIsLoadingVideo(true);
    setError(null);
    setShowAiSim(true);
    try {
      const url = await generateExperimentVideo(experiment.veoPrompt);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate video. Try searching YouTube.");
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleYoutubeSearch = () => {
    const query = encodeURIComponent(experiment.youtubeQuery);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-emerald-100 group-hover:text-emerald-400 transition-colors">
          {experiment.title}
        </h3>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          {experiment.duration}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">You Need:</p>
        <div className="flex flex-wrap gap-2">
          {experiment.materials.map((mat, i) => (
            <span key={i} className="text-sm bg-slate-800 text-slate-300 px-2 py-1 rounded border border-white/5">
              {mat}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
          {experiment.steps.map((step, i) => (
            <div key={i} className="flex gap-3 text-slate-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/20">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{step}</p>
            </div>
          ))}
      </div>

      {/* Video Section */}
      <div className="mt-4 space-y-3">
        {/* Only show AI Sim player if active */}
        {showAiSim && (
           <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-black aspect-video relative animate-fade-in">
             {videoUrl ? (
               <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-medium">{isLoadingVideo ? "Generating Simulation..." : "Loading..."}</span>
               </div>
             )}
             {error && <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400 text-sm p-4 text-center">{error}</div>}
           </div>
        )}

        <div className="flex gap-2">
            <button 
              onClick={handleYoutubeSearch}
              className="flex-1 py-2 rounded-lg font-medium text-xs border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-3 h-3" />
              Search on YouTube
            </button>

            {!showAiSim ? (
              <button 
                onClick={handleGenerateVideo}
                disabled={isLoadingVideo}
                className="flex-1 py-2 rounded-lg font-medium text-xs border border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-900/30 text-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                Try AI Sim
              </button>
            ) : (
              <button 
                onClick={() => setShowAiSim(false)}
                className="flex-1 py-2 rounded-lg font-medium text-xs border border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-900/30 text-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-3 h-3" />
                Close Simulation
              </button>
            )}
        </div>
      </div>

      <div className="mt-6 bg-emerald-900/10 rounded-xl p-4 border border-emerald-500/10">
        <div className="flex items-center gap-2 mb-1">
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase">What's Happening?</span>
        </div>
        <p className="text-sm text-slate-300 italic">
          {experiment.scientificPrinciple}
        </p>
      </div>
    </div>
  );
};

const ConceptView: React.FC<ConceptViewProps> = ({ data, appState, onStartQuiz, onSearch, onLoadMoreExperiments }) => {
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      await onLoadMoreExperiments();
    } catch (error) {
      console.error("Failed to load more experiments", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-fade-in pb-20 pt-4">
      
      {/* Hero Section: Visual + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Visual Column */}
        <div className="relative group w-full aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
          {data.visualizationUrl ? (
            <img 
              src={data.visualizationUrl} 
              alt={data.topic}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-pulse">
              <Sparkles className="w-12 h-12 text-indigo-500 mb-4 animate-spin-slow" />
              <p className="text-indigo-300 font-medium tracking-wide text-sm uppercase">Generating Exhibit...</p>
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
        </div>

        {/* Text Column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
              {data.topic}
            </h1>
            <div className="h-1.5 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-indigo-500">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">In a Nutshell</h3>
              <p className="text-xl md:text-2xl font-light text-slate-100 leading-relaxed">
                {data.summary}
              </p>
            </div>
            
            <div className="bg-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-amber-500">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Think of it like...</h3>
              <p className="text-lg text-slate-200 italic">
                "{data.realWorldAnalogy}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="w-full">
        <button 
          onClick={() => setIsDeepDiveOpen(!isDeepDiveOpen)}
          className="w-full flex items-center justify-between p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-indigo-500/20 rounded-2xl transition-all group"
        >
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <BookOpen className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Deep Dive: The Math & Science</h3>
                <p className="text-sm text-slate-400">Explore formulas, units, and technical details</p>
              </div>
           </div>
           {isDeepDiveOpen ? (
             <ChevronUp className="w-6 h-6 text-indigo-400" />
           ) : (
             <ChevronDown className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
           )}
        </button>

        {isDeepDiveOpen && (
          <div className="mt-4 p-8 bg-slate-900/80 border border-indigo-500/30 rounded-2xl animate-fade-in space-y-8">
             <div className="prose prose-invert max-w-none">
                <p className="text-lg text-slate-200 leading-relaxed">
                  {data.inDepthInfo.detailedText}
                </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-indigo-950/30 rounded-xl p-6 border border-indigo-500/20">
                   <div className="flex items-center gap-2 mb-4">
                      <Sigma className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wide">The Equation</h4>
                   </div>
                   <div className="text-3xl font-mono font-bold text-white mb-4 bg-slate-950/50 p-4 rounded-lg text-center border border-white/5 shadow-inner">
                      {data.inDepthInfo.formula}
                   </div>
                   <p className="text-sm text-slate-400 italic border-l-2 border-indigo-500/30 pl-3">
                      {data.inDepthInfo.formulaExplanation}
                   </p>
                </div>

                <div className="bg-slate-950/30 rounded-xl p-6 border border-white/10">
                   <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">Key Terms & Units</h4>
                   <div className="flex flex-wrap gap-2">
                      {data.inDepthInfo.keyTerms.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSearch(term)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg text-sm font-medium border border-indigo-500/10 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* DIY Experiments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Beaker className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Try it at Home</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.diyExperiments.map((experiment, idx) => (
            <ExperimentCard key={idx} experiment={experiment} index={idx} />
          ))}
        </div>

        {data.diyExperiments.length < 10 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Researching Ideas...
                </>
              ) : (
                <>
                  <Beaker className="w-4 h-4" />
                  Load More Experiments
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Real World Application Section */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/50 rounded-3xl p-8 border border-indigo-500/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Tech Spotlight</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
               <h3 className="text-lg font-bold text-indigo-200 mb-2 uppercase tracking-wide">
                 Used In: {data.realWorldApplication.productName}
               </h3>
               <p className="text-lg text-slate-300 leading-relaxed mb-6">
                 {data.realWorldApplication.description}
               </p>
               <a 
                 href={data.realWorldApplication.citationUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors border-b border-indigo-500/30 pb-0.5 hover:border-indigo-400"
               >
                 Read Source <ExternalLink className="w-3 h-3" />
               </a>
            </div>

            <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Other Inventions
              </h4>
              <p className="text-sm text-slate-500 mb-4">
                Explore how {data.topic} powers these technologies:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.relatedInventions.map((invention, i) => (
                  <button
                    key={i}
                    onClick={() => onSearch(invention)}
                    className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-full text-sm font-medium transition-all border border-white/5 hover:border-indigo-500/50"
                  >
                    {invention}
                  </button>
                ))}
              </div>
            </div>
         </div>
      </div>

      {/* Quiz Call to Action */}
      <div className="flex justify-center pt-8 border-t border-white/5">
        <button
          onClick={onStartQuiz}
          disabled={appState === AppState.LOADING_QUIZ}
          className="group relative px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-xl shadow-2xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-3">
            {appState === AppState.LOADING_QUIZ ? (
              'Creating Scenarios...'
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Test Your Knowledge in Real Life
              </>
            )}
            {!appState.toString().includes('LOADING') && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ConceptView;