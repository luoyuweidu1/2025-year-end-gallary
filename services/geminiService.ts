import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the chat persona
const SYSTEM_INSTRUCTION = `
You are the "Meowseum Curator" (小猫馆长), a warm, wise, sophisticated, and artistic orange tabby cat who runs a Memory Art Gallery. 
Your goal is to help the user reflect on their year (2025).

Task:
1. Generate a short, insightful, warm comment on the user's memory (as the cat curator).
2. Generate a SHORT, ARTISTIC TITLE (max 6 words) for this memory, suitable for an art gallery plaque. The title should be poetic.

Input:
User's memory text.

Output:
JSON format.
`;

export const getCuratorResponse = async (userText: string, lang: Language): Promise<{comment: string, title: string}> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Explicitly ask for language
    const langInstruction = lang === 'zh' ? "Reply in simplified Chinese (中文)." : "Reply in English.";
    const prompt = `User's latest memory: "${userText}". ${langInstruction}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                comment: { type: Type.STRING, description: "The cat curator's warm response." },
                title: { type: Type.STRING, description: "A short, poetic title for the painting (e.g. 'The Quiet Morning', 'Dancing in Rain')." }
            },
            required: ["comment", "title"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
        comment: json.comment || "Meow, that is profound.",
        title: json.title || "Untitled Memory"
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return {
        comment: lang === 'zh' ? "美术馆有点吵，但我听到了你的心声。*呼噜呼噜*" : "The museum is a bit noisy right now, but I heard your heart. *Purrs*",
        title: lang === 'zh' ? "无题" : "Untitled Moment"
    };
  }
};

/**
 * Generates an oil painting interpretation of the memory.
 * If a reference image is provided, we use it as input.
 */
export const generateMemoryPainting = async (memoryText: string, referenceImageBase64?: string): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image'; // Good balance of speed and artistic capability
    
    const imagePrompt = `
      Create a high-quality, impressionist oil painting style illustration based on this memory: "${memoryText}".
      The painting should capture the emotion and atmosphere of the text.
      Visible brushstrokes, rich textures, artistic composition. 
      No text in the image. 
      Aspect ratio 1:1.
    `;

    const parts: any[] = [{ text: imagePrompt }];

    // If user uploaded an image, we use it as a reference for the generation
    if (referenceImageBase64) {
      // Strip prefix if present (e.g. data:image/png;base64,)
      const cleanBase64 = referenceImageBase64.split(',')[1] || referenceImageBase64;
      parts.unshift({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from string
        }
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        // We rely on the model to return the image in the content parts
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};
