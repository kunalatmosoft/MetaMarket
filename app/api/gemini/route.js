// app/api/gemini/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not found in env");
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// Enhanced JSON schema
const desiredOutputSchema = {
  name: "market_evaluation",
  type: "object",
  properties: {
    recommendation: { type: "string", enum: ["STRONG_YES", "YES", "MAYBE", "NO", "STRONG_NO"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    estimated_return_pct: { type: "number" },
    rationale: { type: "string" },
    main_drivers: { type: "array", items: { type: "string" } },
    suggested_bet_size_usd: { type: "number" },
    archetype: { type: "string" },
    risk_factors: { type: "array", items: { type: "string" } }, // new
    time_dynamics: { type: "string" }, // new
    scenario_analysis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          outcome: { type: "string" },
          probability: { type: "number" }
        }
      }
    },
    liquidity_estimate: { type: "string" }, // new: "high", "medium", "low"
    suggested_market_wording: { type: "string" } // new
  },
  required: ["recommendation", "confidence", "rationale"]
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, resolution_date, market_type, reference_links = [] } = body;

    const prompt = `
You are an expert prediction-market analyst. 
Evaluate whether this is a strong candidate for Polymarket.

Market title: ${title}
Description: ${description}
Resolution date: ${resolution_date || "unknown"}
Market type: ${market_type || "binary"}
Reference links: ${reference_links.join(", ") || "none"}

Return ONLY valid JSON with this schema:
- recommendation (STRONG_YES | YES | MAYBE | NO | STRONG_NO)
- confidence (0..1)
- estimated_return_pct (percent, if applicable)
- rationale (short narrative)
- main_drivers (list of main price movers)
- suggested_bet_size_usd (optional number)
- archetype (e.g. political, sports, crypto)
- risk_factors (list of key risks or counterarguments)
- time_dynamics (short description of how market confidence evolves over time)
- scenario_analysis (array of { outcome, probability })
- liquidity_estimate ("high", "medium", "low" expected trader activity)
- suggested_market_wording (better phrasing of the market for Polymarket style)
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const rawText = result.response.text();
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      return NextResponse.json(
        {
          error: "model_output_parse_error",
          raw: rawText,
          message: "Gemini did not return valid JSON"
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ evaluation: parsed });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
