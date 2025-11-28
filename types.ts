export interface Note {
  id: string;
  text: string;
  timestamp: number;
  author: 'user' | 'community' | 'ai';
  sentiment?: 'happy' | 'sad' | 'angry' | 'neutral' | 'love';
  color: string;
  rotation: number;
  swaySpeed: 'slow' | 'medium' | 'fast';
}

export interface SentimentResponse {
  sentiment: 'happy' | 'sad' | 'angry' | 'neutral' | 'love';
  colorHex: string;
}

export interface CommunityNoteResponse {
  text: string;
  sentiment: 'happy' | 'sad' | 'angry' | 'neutral' | 'love';
}