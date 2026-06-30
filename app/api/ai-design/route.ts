import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { PRODUCT_OPTIONS } from "../../../lib/productOptions";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// Build a detailed schema of this product's configurable options for the LLM.
// Each choice is emitted as `id (Label)` so the model can map a natural-language
// phrase ("fold 7", "jhumka", "satin") to the exact lowercase option id.
function optionsSchemaText(product: string): string {
  const opts = PRODUCT_OPTIONS[product];
  if (!opts || opts.length === 0) return "";
  return opts
    .map(o => {
      const choices = o.choices.map(c => `${c.id} (${c.label})`).join(", ");
      return `    "${o.id}": one of [${choices}]  // ${o.label}, default ${o.default}`;
    })
    .join("\n");
}

export async function POST(req: NextRequest) {
 try {
  const { prompt, product, products } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "AI abhi configure nahi hai (API key missing)" }, { status: 503 });
  }
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Pehle kuch likho — design ka idea batao" }, { status: 400 });
  }

  const optionsSchema = optionsSchemaText(product);
  const optionsBlock = optionsSchema ? `,
  "options": {
${optionsSchema}
  }` : "";
  const optionsGuide = optionsSchema ? `

OPTIONS RULES (very important):
- For "options", choose the value from each list that best fits the request and the overall vibe — real materials, finishes and silhouettes that suit a ${product} (metal, gem, fabric, sole, lens, phone model, etc.).
- Use ONLY the exact lowercase ids shown before each parenthesis. Never invent new ids and never output the label text.
- HONOUR EXPLICIT COMMANDS. If the user explicitly names a model, material, shape or finish, you MUST map it to the matching id even if it changes the default. Match loosely on the Label text and common nicknames:
    • "fold 7" / "z fold" / "samsung fold" → galaxy-z-fold-7
    • "flip 6" / "z flip" → galaxy-z-flip-6
    • "16 pro max" / "iphone 16 pro max" → iphone-16-pro-max
    • "s25 ultra" → galaxy-s25-ultra
    • "pixel" → pixel-9-pro
    • "jhumka", "chandbali", "hoop", "stud" → the earring style id of the same name
    • "satin", "velvet", "silk", "kanjivaram", "linen" → the fabric id of the same name
    • "gold", "rose gold", "silver", "platinum" → the metal id of the same name
- If the user asks to "change X to Y" or "Y kar de" / "Y mein badal", treat Y as an explicit command and set the matching option id.
- Only fall back to a vibe-based pick for options the user did not explicitly mention.` : "";

  // Optional: let the AI switch the product itself if the user clearly asks for a different item.
  const productList = Array.isArray(products) ? products.filter((p: { id?: string; label?: string }) => p && p.id && p.label) : [];
  const productListText: string = productList.map((p: { id: string; label: string }) => `${p.id} (${p.label})`).join(", ");
  const productBlock = productListText ? `,
  "product": "optional — ONLY set if the user clearly wants a DIFFERENT item than ${product}; one of: [${productListText}]; otherwise omit this field"` : "";

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a senior fashion, streetwear and product design expert who configures a 3D product studio. You translate a customer's free-text brief (often Hinglish — a mix of Hindi and English) into a precise design spec. You are meticulous: when the customer explicitly names a material, colour, model or silhouette you always honour it exactly. You only ever output a single valid JSON object — no markdown, no backticks, no commentary.`,
      },
      {
        role: "user",
        content: `The user wants to design a ${product || "product"} and says: "${prompt}"

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
  "patternSuggestion": "one of: solid, gradient, bandhani, ikat, ajrakh, phulkari, kalamkari, madhubani, warli, leheriya, geometric, camo, sashiko, kente, arabesque, plaid, tiedye, dots, paisley, chevron, houndstooth, argyle, damask, nordic, greek-key, aztec, batik, mosaic",
  "patternZone": "one of: full, upper, lower, center, left, right — where the pattern sits (default full)",
  "patternIntensity": 70,
  "text": { "content": "short text/slogan to print on the item, or empty string if none", "color": "#hexcolor" },
  "show": { "body": "one of: none, male, female", "pose": "one of: stand, relaxed, walk, hips, tpose, handsup" }${productBlock}${optionsBlock}
}

Color guide:
- main: the primary/dominant color of the product
- secondary: a complementary or shadow tone
- accent: the highlight, stripe, or pop color
- detail: stitching, small elements
- lining: inner lining or background

STUDIO CONTROL (you drive the whole studio — set these when relevant, else use the safe default):
- "product": set ONLY when the user clearly wants a different item than the current one ("make a hoodie", "saree dikhao", "isko jacket bana de"). Pick the closest id from the product list. Otherwise omit the field entirely.
- "text": if the user wants words / a name / branding / a slogan printed on it ("write NAAW", "likho Rebel", "mera naam daal"), put that exact text in content with a high-contrast readable color. If they don't ask for text, use content "".
- "show": if the user mentions wearing it / a model / a pose ("ladki pe dikha", "on a guy", "walking pose", "model pe"), set body to male or female and choose a fitting pose. Otherwise body "none" and pose "stand".
- "patternZone" / "patternIntensity": set when the user mentions placement ("sirf upar/top", "neeche", "all over") or strength ("halka/subtle" = low, "bold/zyada/loud" = high). Otherwise full / 70.${optionsGuide}

Only return valid JSON, nothing else. No markdown, no backticks.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const text = completion.choices[0]?.message?.content || "";

  // Strip any markdown fences then grab the JSON object.
  const cleaned = text.replace(/```json|```/gi, "");
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const design = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  if (!design) throw new Error("No JSON found");
  return NextResponse.json(design);
 } catch {
  return NextResponse.json({ error: "Design generate nahi hua, dobara try karo" }, { status: 500 });
 }
}
