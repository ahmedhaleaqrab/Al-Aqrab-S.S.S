
import { GoogleGenAI } from "@google/genai";
import { UserRole } from "../types";

/**
 * وظيفة عامة للحصول على تحليلات ذكية بناءً على الدور والسياق
 */
export const getSmartAnalysis = async (role: UserRole, context: string) => {
  // Fix: Initialize GoogleGenAI instance right before the call as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let systemInstruction = "";

  switch (role) {
    case UserRole.ADMIN:
      systemInstruction = `أنت "المحلل الإداري الذكي" لنظام العقرب. حلل البيانات الإدارية، اقترح خططاً لتحسين الأداء، ركز على الإنتاجية وتطوير المؤسسة.`;
      break;
    case UserRole.TEACHER:
      systemInstruction = `أنت "المعلم التحليلي الذكي". مهمتك:
      - تحليل مستويات الأسئلة (سهل/متوسط/صعب).
      - اقتراح أسئلة جديدة بناءً على نقاط ضعف الطلاب.
      - شرح كيفية توزيع الأسئلة لمنع الغش (shuffling).
      - تقديم نصائح بيداغوجية لتحسين توصيل المعلومة.`;
      break;
    case UserRole.STUDENT:
      systemInstruction = `أنت "المحلل الطلابي الذكي". ركز على:
      - تحليل الأخطاء وتوجيه الطالب للمراجعة.
      - تقديم "ومضات تثبيت" (Subconscious triggers) لترسيخ المعلومة.
      - اقتراح جدول مراجعة ذكي بناءً على المواد التي يجد فيها صعوبة.`;
      break;
    case UserRole.ACCOUNTANT:
      systemInstruction = `أنت "المحاسب التحليلي الذكي". مهمتك:
      - تحليل التدفقات النقدية والبحث عن الهدر المالي.
      - اقتراح إعادة توزيع الميزانية (خطوط الميزانية).
      - التنبؤ بالمستحقات المالية المتأخرة ووضع خطط لتحصيلها.`;
      break;
    default:
      systemInstruction = "أنت مساعد ذكي في نظام العقرب التعليمي.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context,
      config: {
        systemInstruction: systemInstruction + " استخدم لغة عربية احترافية ومباشرة بصيغة اقتراحات قابلة للتنفيذ.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "عذراً، المحلل الذكي يحتاج لحظة لإعادة معالجة البيانات.";
  }
};

export const getSmartTutorResponse = async (question: string) => {
  // Fix: Initialize GoogleGenAI instance right before the call as per guidelines
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
