import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { PRODUCT_OPTIONS } from "../../../lib/productOptions";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// Build a compact schema of this product's configurable options for the LLM
function optionsSchemaText(product: string): string {
  const opts = PRODUCT_OPTIONS[product];
  if (!opts || opts.length === 0) return "";
  return opts
    .map(o => `    "${o.id}": one of [${o.choices.map(c => c.id).join(", ")}]  // ${o.label}`)
    .join("\n");
}

export async function POST(req: NextRequest) {
  const { prompt, product } = await req.json();

  const optionsSchema = optionsSchemaText(product);
  const optionsBlock = optionsSchema ? `,
  "options": {
${optionsSchema}
  }` : "";
  const optionsGuide = optionsSchema ? `

For "options", pick the value from each list that best fits the user's request and the overall vibe — real materials and finishes that suit a ${product} (metal, glass/lens, fabric, sole, gem, etc.). Use ONLY the exact lowercase values shown in the lists above; never invent new ones.` : "";

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
  "patternSuggestion": "one of: solid, gradient, bandhani, ikat, ajrakh, phulkari, kalamkari, madhubani, warli, leheriya, geometric, camo, sashiko, kente, arabesque, plaid, tiedye, dots"${optionsBlock}
}

Color guide:
- main: the primary/dominant color of the product
- secondary: a complementary or shadow tone
- accent: the highlight, stripe, or pop color
- detail: stitching, small elements
- lining: inner lining or background${optionsGuide}

Only return valid JSON, nothing else. No markdown, no backticks.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 600,
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
