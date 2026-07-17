import { NextResponse } from "next/server";
import { recipePromptSchema } from "@/lib/validators";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = recipePromptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
  }

  const prompt = `Generate 3 simple recipe suggestions using only these pantry items: ${parsed.data.items.join(", ")}. Include dish name, ingredients, and short instructions.`;

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful recipe assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: "AI request failed", details: errorText }, { status: 502 });
  }

  const data = await response.json();

  return NextResponse.json({ result: data });
}
