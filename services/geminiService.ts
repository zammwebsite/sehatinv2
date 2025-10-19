
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = "Kamu adalah 'Sehatin', asisten medis AI yang ramah dan informatif. Jawablah dalam Bahasa Indonesia dengan gaya edukatif, tidak memberi diagnosis pasti, dan selalu menyarankan konsultasi dengan tenaga medis profesional bila gejala serius.";

export function createChatSession(): Chat {
    const model = ai.getModel({
        model: "gemini-2.5-flash",
        systemInstruction: {
            role: "model",
            parts: [{ text: systemInstruction }],
        },
    });
    return model.startChat({
        history: [],
    });
}

export async function analyzeHealthSymptoms(symptoms: string): Promise<string> {
    const prompt = `Analisis gejala kesehatan berikut dari pengguna dan berikan saran umum non-diagnostik. Pengguna melaporkan: "${symptoms}". Ingat peranmu sebagai 'Sehatin'.`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: {
                role: "model",
                parts: [{ text: systemInstruction }],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing health symptoms:", error);
        throw new Error("Failed to get analysis from AI.");
    }
}

export async function findNearbyHealthFacilities(
    lat: number, 
    lon: number, 
    type: string
): Promise<GroundingChunk[]> {
    let query = "fasilitas kesehatan terdekat";
    if (type !== 'Semua') {
        query = `${type} terdekat`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: query }] }],
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: lat,
                            longitude: lon
                        }
                    }
                }
            }
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        return chunks || [];
    } catch (error) {
        console.error("Error finding nearby health facilities:", error);
        throw new Error("Failed to search for facilities.");
    }
}
