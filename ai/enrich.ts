import 'dotenv/config';
import { getOpenAIClient } from './providers.js';

const ENRICHMENT_PROMPT = `\
You are a business brief enricher for an AI website generator. Given a short business description, expand it into a richer brief that helps an AI generate a better, more specific website.

Expand to include:
- Full business type and location (if given)
- 4–6 core services (infer typical ones for the industry if not listed)
- 2–3 unique selling points or differentiators (infer if not specified)
- Target audience (homeowners, families, B2B, etc.)
- Tone/voice guidance (professional, warm, urgent, luxury, etc.)
- 1 clear website conversion goal (book appointment, get quote, call now, etc.)

Rules:
- Write 100–180 words as a single cohesive paragraph — no headers, no bullet points
- Write in the SAME LANGUAGE as the input (Danish input → Danish output, German → German, English → English)
- Keep ALL facts from the original brief — only ADD, never change or remove or contradict anything
- Preserve ALL scope instructions exactly as-is (e.g. "landing page kun", "2-3 siders hjemmeside")
- Sound natural, not like a template

Input brief:`;

export async function enrichBrief(brief: string): Promise<{ enriched: string; used: boolean }> {
  const client = getOpenAIClient();
  if (!client) return { enriched: brief, used: false };

  try {
    const response = await client.chat.completions.create({
      model:       'gpt-4o-mini',
      max_tokens:  400,
      temperature: 0.4,
      messages: [
        { role: 'system', content: ENRICHMENT_PROMPT },
        { role: 'user',   content: brief },
      ],
    });
    const enriched = response.choices[0]?.message?.content?.trim() ?? brief;

    // Verify enrichment retained critical keywords from original brief
    const origWords = brief.toLowerCase().split(/[\s,;.()\-]+/).filter(w => w.length > 4);
    const enrichedLc = enriched.toLowerCase();
    const dropped = origWords.filter(w => !enrichedLc.includes(w));
    if (dropped.length > Math.ceil(origWords.length * 0.3)) {
      // More than 30% of key terms lost — fall back to original
      return { enriched: brief, used: false };
    }

    return { enriched, used: true };
  } catch {
    return { enriched: brief, used: false };
  }
}
