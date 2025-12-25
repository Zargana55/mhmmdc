
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const verifyTaskProof = async (screenshotBase64: string, targetAccount: string, platform: string) => {
  try {
    // Correctly structured call using named properties and the recommended contents object format
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: `Analyze this screenshot. Does it show that the user is currently following the account "${targetAccount}" on the platform "${platform}"? Look for "Following" or "Takip ediliyor" buttons. Return JSON: { "isFollowing": boolean, "confidence": number, "reason": string }.` },
          { inlineData: { mimeType: 'image/jpeg', data: screenshotBase64 } }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isFollowing: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ['isFollowing', 'confidence', 'reason']
        }
      }
    });

    // Access the .text property directly and parse the resulting JSON string
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Model returned an empty response.");
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return { isFollowing: false, confidence: 0, reason: "Error in AI verification" };
  }
};
