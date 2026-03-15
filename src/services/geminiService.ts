import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const taskAssistantSchema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      enum: ["CREATE_TASK", "UPDATE_TASK", "DELETE_TASK", "LIST_TASKS", "UNKNOWN"],
      description: "The action the user wants to perform"
    },
    taskData: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        status: { type: Type.STRING, enum: ["todo", "in-progress", "done"] },
        taskId: { type: Type.STRING }
      }
    },
    reasoning: { type: Type.STRING, description: "Brief explanation of the action" }
  },
  required: ["action"]
};

export async function processTaskCommand(prompt: string, context: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Context: ${context}\n\nUser Command: ${prompt}`,
    config: {
      systemInstruction: "You are a task management assistant. Analyze the user's command and the current project context to determine the intended action. If creating or updating a task, extract the relevant details. If the command is ambiguous, return UNKNOWN.",
      responseMimeType: "application/json",
      responseSchema: taskAssistantSchema as any
    }
  });

  return JSON.parse(response.text || "{}");
}
