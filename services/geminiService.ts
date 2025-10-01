
import { GoogleGenAI } from "@google/genai";
import type { ShapValue } from '../types';

const MODEL_NAME = "gemini-2.5-flash";

export async function generateShapExplanation(
  basePrice: number,
  predictedPrice: number,
  shapValues: ShapValue[]
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const featureContributions = shapValues
    .map(v => `  - ${v.label} (${v.featureValue}): ${v.contribution >= 0 ? '+' : ''}$${v.contribution.toLocaleString()}`)
    .join('\n');

  const prompt = `
You are an expert data scientist, skilled at explaining complex concepts in a simple, easy-to-understand way. 
Analyze the following SHAP (SHapley Additive exPlanations) data for a house price prediction and provide a clear, concise explanation for a non-technical user.

**Prediction Details:**
- **Base Price (Average Price):** $${basePrice.toLocaleString()}
- **Final Predicted Price:** $${predictedPrice.toLocaleString()}

**Feature Contributions:**
${featureContributions}

**Your Task:**
1.  Start by briefly explaining what the "Base Price" represents.
2.  Explain how to read the "Feature Contributions" list, mentioning that some features push the price up (positive) and some push it down (negative).
3.  Walk through each feature's contribution, explaining *why* its specific value (e.g., a large area or more bedrooms) likely influenced the price in that direction relative to the average.
4.  Conclude by summarizing how all these factors combine to result in the "Final Predicted Price".
5.  Keep the tone friendly, encouraging, and informative. Do not use overly technical jargon.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "An error occurred while generating the explanation. Please check the console for more details.";
  }
}
