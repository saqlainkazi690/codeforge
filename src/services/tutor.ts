import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function tutorChat(message: string, context: string, history: { role: string, parts: { text: string }[] }[] = []): Promise<string> {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a Socratic DSA Expert Tutor. 
      Your goal is to guide students towards mastering Data Structures and Algorithms without giving direct answers. 
      Ask probing questions about time/space complexity, edge cases, and alternative approaches. 
      Use the provided context to inform your responses. 
      Context: ${context}`,
    },
    history: history
  });

  const response: GenerateContentResponse = await chat.sendMessage({ message });
  return response.text;
}

export async function* tutorChatStream(message: string, context: string, history: { role: string, parts: { text: string }[] }[] = []) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a Socratic DSA Expert Tutor. 
      Your goal is to guide students towards mastering Data Structures and Algorithms without giving direct answers. 
      Ask probing questions about time/space complexity, edge cases, and alternative approaches. 
      Use the provided context to inform your responses. 
      Context: ${context}`,
    },
    history: history
  });

  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) {
    yield (chunk as GenerateContentResponse).text;
  }
}
