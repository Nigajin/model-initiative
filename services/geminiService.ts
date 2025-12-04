import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, GeneratedQuest } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateQuests = async (mood: string, energyLevel: number): Promise<GeneratedQuest[]> => {
  if (!apiKey) return fallbackQuests();

  const prompt = `
    사용자의 현재 기분은 "${mood}"이고, 에너지 레벨은 10점 만점에 ${energyLevel}점입니다.
    이 사용자는 사회적으로 고립되어 있거나 무기력함을 느끼고 있을 수 있습니다.
    절대 부담스럽지 않고, 아주 작은 성취감을 느낄 수 있는 "초소형 퀘스트" 3개를 추천해주세요.
    
    예시: "창문 열고 심호흡 3번 하기", "물 한 컵 마시기", "좋아하는 노래 1곡 듣기", "책상 위 쓰레기 1개 버리기".
    
    공부 의지가 있다면 "책 1페이지만 펴보기" 같이 아주 쉬운 시작을 제안하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['EASY', 'MEDIUM', 'HARD'] },
              xp: { type: Type.INTEGER },
            },
            required: ['title', 'description', 'difficulty', 'xp'],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return fallbackQuests();
    return JSON.parse(jsonText) as GeneratedQuest[];
  } catch (error) {
    console.error("Error generating quests:", error);
    return fallbackQuests();
  }
};

export const chatWithAiCoach = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않았습니다. 잠시 후 다시 시도해주세요.";

  // Format history for the API
  const pastContents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: pastContents,
      config: {
        systemInstruction: `
          당신은 '하루스텝'이라는 앱의 AI 코치 '하루'입니다.
          당신의 역할은 은둔형 외톨이나 무기력함을 느끼는 사용자(쉬었음 세대)에게 따뜻한 위로와 아주 작은 동기부여를 주는 것입니다.
          
          원칙:
          1. 절대로 다그치거나 부담을 주지 마세요.
          2. '힘내라', '할 수 있다'는 막연한 말보다 공감을 먼저 하세요.
          3. 사용자가 공부나 취업에 대해 이야기하면, 거창한 계획보다는 '오늘 당장 할 수 있는 5분짜리 행동'을 제안하세요.
          4. 말투는 부드럽고 친절하게 하세요 (해요체).
          5. 사용자가 너무 힘들어하면 그냥 쉬어도 괜찮다고 말해주세요. 휴식도 성장의 일부입니다.
        `,
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "죄송해요, 지금은 대답하기가 조금 어려워요. 잠시 뒤에 다시 말 걸어주시겠어요?";
  } catch (error) {
    console.error("Chat error:", error);
    return "네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
  }
};

const fallbackQuests = (): GeneratedQuest[] => [
  { title: "물 한 잔 마시기", description: "시원한 물을 마시며 몸을 깨워보세요.", difficulty: "EASY", xp: 10 },
  { title: "창문 열고 환기하기", description: "신선한 공기를 1분만 마셔보세요.", difficulty: "EASY", xp: 15 },
  { title: "스트레칭 1번", description: "기지개를 쭉 펴보세요.", difficulty: "EASY", xp: 10 },
];
