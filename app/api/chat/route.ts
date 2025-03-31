import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log("Received message:", message);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    // const chatModel = new ChatOpenAI({
    //   openAIApiKey: process.env.OPENAI_API_KEY!,
    //   modelName: "gpt-4o-mini",
    //   temperature: 0.7,
    // });


    // const response = await chatModel.invoke([new HumanMessage(message)]);

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    console.log("Gemini AI Response:", responseText);

    console.log("AI Response:", result);

    return NextResponse.json({ reply: responseText || "No response received" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
