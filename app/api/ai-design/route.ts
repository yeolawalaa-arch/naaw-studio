import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: NextRequest) {
  const { prompt, product } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `You are a fashion and streetwear design expert. The user wants to design a ${product || "product"} and says: "${prompt}"

Return a JSON object with these exact fields:
{
  "colors": {
    "main": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor",
    "detail": "#hexcolor",
    "lining": "#hexcolor"
  },
  "style": "one word style (e.g. streetwear, retro, minimal, futuristic, luxury, traditional, ethnic)",
  "description": "2-3 sentence description of the design in Hinglish (mix of Hindi and English)",
  "patternSuggestion": "one of: solid, gradient, bandhani, ikat, ajrakh, phulkari, kalamkari, madhubani, warli, leheriya, geometric, camo, sashiko, kente, arabesque, plaid, tiedye, dots"
}

Color guide:
- main: the primary/dominant color of the product
- secondary: a complementary or shadow tone
- accent: the highlight, stripe, or pop color
- detail: stitching, small elements
- lining: inner lining or background

Only return valid JSON, nothing else. No markdown, no backticks.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  const text = completion.choices[0]?.message?.content || "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const design = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    if (!design) throw new Error("No JSON found");
    return NextResponse.json(design);
  } catch {
    return NextResponse.json({ error: "Design generate nahi hua, dobara try karo" }, { status: 500 });
  }
}
