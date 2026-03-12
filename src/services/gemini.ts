import { GoogleGenAI, Type } from "@google/genai";
import { Question, BloomLevel } from "../types/shared";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateQuestions(topic: string, count: number = 3): Promise<Question[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} unique Data Structures and Algorithms questions for the topic: "${topic}".
    Include a mix of multiple_choice and code challenges.
    For code challenges, provide "starter_code", "test_cases" (input/expected), and "constraints".
    Return the result as a JSON array matching the specified schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, description: "multiple_choice | code" },
            bloom_level: { type: Type.STRING },
            difficulty: { type: Type.INTEGER, description: "1-5" },
            topic: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Only for multiple_choice"
            },
            correct_answer: { type: Type.STRING, description: "For MCQ, the correct option. For code, the reference solution." },
            explanation: { type: Type.STRING },
            estimated_seconds: { type: Type.INTEGER },
            starter_code: { type: Type.STRING },
            constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
            test_cases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  input: { type: Type.STRING },
                  expected: { type: Type.STRING }
                }
              }
            }
          },
          required: ["id", "type", "bloom_level", "difficulty", "topic", "question", "correct_answer", "explanation", "estimated_seconds"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function evaluateCode(question: Question, code: string): Promise<{ correct: boolean; feedback: string; score: number }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate the following code for the DSA problem: "${question.question}".
    Code:
    \`\`\`
    ${code}
    \`\`\`
    Reference Solution: ${question.correct_answer}
    Test Cases: ${JSON.stringify(question.test_cases)}
    
    Provide a JSON response with:
    - correct: boolean
    - feedback: string (brief, constructive)
    - score: number (0.0 to 1.0)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correct: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING },
          score: { type: Type.NUMBER }
        },
        required: ["correct", "feedback", "score"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateLearningPath(goal: string, currentSkills: any[]): Promise<any> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a week-by-week study plan for a student with the goal: "${goal}".
    Current skill state: ${JSON.stringify(currentSkills)}.
    Return a structured JSON with weeks, topics, and recommended activities.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          goal: { type: Type.STRING },
          weeks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.INTEGER },
                focus: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                activities: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
