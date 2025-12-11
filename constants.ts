import { StudentLevel } from "./types";

export const LEVELS = [
  StudentLevel.PRIMARY,
  StudentLevel.MIDDLE,
  StudentLevel.HIGH,
  StudentLevel.UNIVERSITY,
];

export const SAMPLE_TOPICS = [
  "Newton's Third Law",
  "Photosynthesis",
  "Compound Interest",
  "Doppler Effect",
  "Thermodynamics",
];

export const SYSTEM_INSTRUCTION_BASE = `
You are a curator at the "SciLife Museum". Your goal is to explain complex scientific and mathematical concepts by directly connecting them to everyday life and practical problem-solving. 
Avoid dry textbook definitions. Use vivid analogies and storytelling.
`;
