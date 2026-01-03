
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole, QuestionType, AnnouncementStatus } from "../types";

/**
 * وظيفة عامة للحصول على تحليلات ذكية بناءً على الدور والسياق
 */
export const getSmartAnalysis = async (role: UserRole, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let systemInstruction = "";

  switch (role) {
    case UserRole.ADMIN:
      systemInstruction = `أنت "المحلل الإداري الذكي" لنظام العقرب. حلل البيانات الإدارية، اقترح خططاً لتحسين الأداء، ركز على الإنتاجية وتطوير المؤسسة.`;
      break;
    case UserRole.TEACHER:
      systemInstruction = `أنت "المعلم التحليلي الذكي". مهمتك: تحليل مستويات الأسئلة، اقتراح تحسينات، وشرح كيفية توزيع الأسئلة لمنع الغش.`;
      break;
    default:
      systemInstruction = "أنت مساعد ذكي في نظام العقرب التعليمي.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context,
      config: {
        systemInstruction: systemInstruction + " استخدم لغة عربية احترافية ومباشرة.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "عذراً، المحلل الذكي يحتاج لحظة لإعادة معالجة البيانات.";
  }
};

/**
 * توليد اختبار كامل بناءً على وصف المعلم
 */
export const generateSmartExam = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "واحد من: true_false, single_choice, short_essay" },
            text: { type: Type.STRING },
            points: { type: Type.NUMBER },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["id", "text"]
              }
            },
            correctAnswer: { type: Type.STRING }
          },
          required: ["type", "text", "points"]
        }
      }
    },
    required: ["title", "description", "questions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بإنشاء اختبار احترافي بناءً على هذا الوصف: ${prompt}`,
      config: {
        systemInstruction: "أنت خبير تربوي في نظام العقرب. قم بتوليد اختبار مهيكل بتنسيق JSON. تأكد أن الأسئلة متنوعة وعلمية دقيقة.",
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Exam Generation Error:", error);
    throw error;
  }
};

export const getSmartTutorResponse = async (question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `أنت "المعلم الذكي" في منصة العقرب التعليمية. قدم إجابات دقيقة وتعليمية بتبسيط.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    return "حدث خطأ في الاتصال بالمعلم الذكي.";
  }
};
