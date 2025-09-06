
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const studyPlanSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      week: {
        type: Type.INTEGER,
        description: 'The week number (1-4).',
      },
      title: {
        type: Type.STRING,
        description: 'A concise title for the week\'s focus.',
      },
      goals: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'A list of specific topics or goals to cover during the week.',
      },
    },
    required: ["week", "title", "goals"],
  },
};

const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: 'The question text.',
            },
            options: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
                description: 'An array of 4 possible answers.',
            },
            answer: {
                type: Type.STRING,
                description: 'The correct answer, which must be one of the options.',
            },
        },
        required: ["question", "options", "answer"],
    },
};


export const generateSummary = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following document, provide a concise and well-structured summary. Highlight key concepts, important points, and definitions:\n\n---\n\n${text}`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
};

export const generateStudyPlan = async (text: string): Promise<StudyPlan> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the provided document and create a comprehensive four-week study strategy. Break down the topics into manageable weekly modules with clear goals. The plan should balance reading, revision, and practice sessions.

        Document Content:
        ---
        ${text}
        ---
        `,
        config: {
            responseMimeType: "application/json",
            responseSchema: studyPlanSchema,
        }
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as StudyPlan;

  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan. The model might have returned an unexpected format.");
  }
};

export const generateQuiz = async (text: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a random quiz with 5 multiple-choice questions based on the content of the following document. Each question must have exactly 4 options, and one must be the correct answer.

        Document Content:
        ---
        ${text}
        ---
        `,
        config: {
            responseMimeType: "application/json",
            responseSchema: quizSchema,
        }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as QuizQuestion[];

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. The model might have returned an unexpected format.");
  }
};
