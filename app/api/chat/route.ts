import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Initialize LangChain with OpenAI
    const chatModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "gpt-4o-mini", // or "gpt-3.5-turbo"
    });

    // Generate AI response
    const response = await chatModel.call([new HumanMessage(message)]);

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
