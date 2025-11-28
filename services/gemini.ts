import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { CommunityNoteResponse, SentimentResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const isApiConfigured = () => !!apiKey;

export const analyzeSentiment = async (text: string): Promise<SentimentResponse> => {
  if (!isApiConfigured()) {
    // Fallback if no API key
    return { sentiment: 'neutral', colorHex: '#fef3c7' };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the sentiment of this text: "${text}". Return a JSON object with 'sentiment' (one of: happy, sad, angry, neutral, love) and a soft pastel 'colorHex' that matches the emotion (e.g., light pink for love, light blue for sad, etc.).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['happy', 'sad', 'angry', 'neutral', 'love'] },
            colorHex: { type: Type.STRING }
          },
          required: ['sentiment', 'colorHex']
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return {
      sentiment: json.sentiment || 'neutral',
      colorHex: json.colorHex || '#fef3c7'
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return { sentiment: 'neutral', colorHex: '#fef3c7' };
  }
};

export const generateCommunityNotes = async (count: number = 3): Promise<CommunityNoteResponse[]> => {
  if (!isApiConfigured()) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} short, poetic, or relatable sentences (in Indonesian or English) about feelings, life, or dreams. They should feel like anonymous confessions or whispers. Return a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['happy', 'sad', 'angry', 'neutral', 'love'] }
            },
            required: ['text', 'sentiment']
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error generating community notes:", error);
    return [];
  }
};