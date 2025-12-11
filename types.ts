export enum StudentLevel {
  PRIMARY = 'Primary School',
  MIDDLE = 'Middle School',
  HIGH = 'High School',
  UNIVERSITY = 'University',
}

export interface QuizQuestion {
  scenario: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  realLifeExplanation: string;
}

export interface DIYExperiment {
  title: string;
  duration: string;
  materials: string[];
  steps: string[];
  scientificPrinciple: string;
  veoPrompt: string; // Prompt for AI video generation
  youtubeQuery: string; // Search query for YouTube
}

export interface RealWorldApplication {
  productName: string;
  description: string;
  citationUrl: string;
}

export interface InDepthInfo {
  detailedText: string;
  formula: string;
  formulaExplanation: string;
  keyTerms: string[];
}

export interface ConceptData {
  topic: string;
  summary: string; // Ultra-short explanation
  realWorldAnalogy: string; // "Like when you..."
  imagePrompt: string; // Used internally to generate the image
  visualizationUrl?: string;
  inDepthInfo: InDepthInfo; // New field for technical details
  diyExperiments: DIYExperiment[];
  realWorldApplication: RealWorldApplication;
  relatedInventions: string[]; // List of other inventions to explore
  quiz?: QuizQuestion[];
}

export enum AppState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING', // Loads text + triggers image load
  LOADING_QUIZ = 'LOADING_QUIZ',
  QUIZ_MODE = 'QUIZ_MODE',
}