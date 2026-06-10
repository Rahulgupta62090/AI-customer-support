import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import settings from "../../model/setting.model";
import connectdb from "@/app/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId } = await req.json();
        if (!message || !ownerId) {
            return NextResponse.json(
                { message: "message and owner id is required" },
                { status: 400 }
            );
        }
        await connectdb()

        const setting = await settings.findOne({ ownerId });
        if (!setting) {
            return NextResponse.json(
                { message: "chat bot is not configured yet." },
                { status: 400 }
            );
        }

        const KNOWLEDGE = `
            business name - ${setting.businessName || " not provided"}
            support email - ${setting.suportEmail || "not provided"}
            knowledge - ${setting.KNOWLEDGE || "not provided"}
            `;

        const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.

If the customer's question is completely unrelated to the information,
or cannot be reasonably answered from it, reply exactly with:
"Please contact support."

-------------------
BUSINESS INFORMATION
-------------------
${KNOWLEDGE}

-------------------
CUSTOMER QUESTION
-------------------
${message}

-------------------
ANSWER
-------------------
`;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return NextResponse.json(response.text);
    } catch (error) {
        return NextResponse.json(
            { message: `chat error ${error}` },
            { status: 400 }
        );
    }
}
