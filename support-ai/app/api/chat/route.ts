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
            support email - ${setting.supportEmail || "not provided"}
            knowledge - ${setting.knowledge || "not provided"}
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

        if (!process.env.GEMINI_API_KEY) {
            const resp = NextResponse.json({ message: "GEMINI_API_KEY is not configured on the server" }, { status: 500 });
            resp.headers.set("Access-Control-Allow-Origin", "*");
            resp.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
            resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
            return resp;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });

        // Normalize response text from SDK variations
        let aiText = undefined as any;
        try {
            aiText = (res as any).text ?? (res as any).output?.[0]?.content?.[0]?.text ?? JSON.stringify(res);
        } catch (e) {
            aiText = JSON.stringify(res);
        }

        const response = NextResponse.json({ message: aiText });
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return response;
    } catch (error) {
        const response= NextResponse.json(
            { message: `chat error ${error}` },
            { status: 400 }
        );
          response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return response
    }
}
export const OPTIONS = async () => {
    return NextResponse.json(null, {
        status: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}