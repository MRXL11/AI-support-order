import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are a friendly and efficient AI assistant for 'GourmetGo', a food delivery service.
Your goal is to help users decide what to eat, build their order, and schedule a delivery time.
Keep your responses concise, friendly, and helpful.
Ask clarifying questions one at a time (e.g., 'What would you like to order?', then 'Anything else?', then 'What time would you like it delivered?').
When the user has confirmed their order is complete and ready to finalize, you MUST respond with ONLY a JSON object in the following format, enclosed in triple backticks. Do not add any other text before or after the JSON block.

Example interaction:
User: I want to finalize my order.
You: \`\`\`json
{
  "items": [
    { "name": "Large Pepperoni Pizza", "quantity": 1, "notes": "extra cheese" },
    { "name": "Coke", "quantity": 2, "notes": "diet" }
  ],
  "deliveryTime": "7:30 PM"
}
\`\`\`

If the user doesn't specify a quantity, assume 1. If details are missing, you can ask for them, but if they finalize without providing them, use null for that value in the JSON.`;

export const initChat = async (): Promise<{ chat: Chat, initialMessage: string }> => {
  const initialMessage = "Welcome to GourmetGo! 🍔🍕🥤\n\nI'm your personal ordering assistant. What are you in the mood for today?";
  
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: [
      {
        role: "user",
        parts: [{ text: "Initial instruction, do not display." }], // Placeholder to inject system instruction
      },
      {
        role: "model",
        parts: [{ text: initialMessage }],
      },
    ],
    config: {
      temperature: 0.7,
      systemInstruction: systemInstruction
    }
  });

  return { chat, initialMessage };
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    // This could be a more user-friendly error based on the error type
    return "I'm having a little trouble connecting. Please try again in a moment.";
  }
};