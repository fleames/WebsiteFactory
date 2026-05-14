import 'dotenv/config';
import { getOpenAIClient } from './providers.js';

export interface ScrapedBusiness {
  name: string;
  type: string;
  city: string;
  phone: string;
  email: string;
  services: string[];
  usps: string[];
  tagline: string;
  brief: string;
}

const EXTRACT_PROMPT = `You are a business data extractor. Given raw text scraped from a business website, extract structured information.

Return ONLY valid JSON with this exact structure:
{
  "name": "Business name or empty string",
  "type": "Business type/industry in the website's language (e.g. Elektriker, Tandlæge, Restaurant, Electrician)",
  "city": "City or region or empty string",
  "phone": "Phone number or empty string",
  "email": "Email address or empty string",
  "services": ["service1", "service2"],
  "usps": ["unique selling point 1", "unique selling point 2"],
  "tagline": "Main headline or slogan or empty string",
  "brief": "A 2-3 sentence description of the business summarising everything found: name, type, location, key services, and any differentiators. Written in the SAME LANGUAGE as the website."
}

Rules:
- Extract only what is clearly present — do not invent facts
- services: max 8 items, short labels (2–4 words)
- usps: max 4 items, things that make them special (e.g. "24/7 service", "Fully insured")
- brief must be ready to use as a website generation prompt
- If a field is not found, use empty string or empty array`;

function extractMeta(html: string): { title: string; description: string } {
  const titleMatch    = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const ogTitle       = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
                     ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const descMeta      = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
                     ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const ogDesc        = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
                     ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  return {
    title:       (ogTitle?.[1]  ?? titleMatch?.[1] ?? '').trim(),
    description: (ogDesc?.[1]   ?? descMeta?.[1]   ?? '').trim(),
  };
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<(p|div|h[1-6]|li|td|br|tr|section|article|header)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function scrapeWebsite(rawUrl: string): Promise<ScrapedBusiness> {
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  let html: string;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteFactory/1.0; +https://github.com/fleames/WebsiteFactory)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en,da,de;q=0.9',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    html = await res.text();
  } finally {
    clearTimeout(timer);
  }

  const meta     = extractMeta(html);
  const bodyText = htmlToText(html).slice(0, 4500);

  const fullText = [
    meta.title       ? `Title: ${meta.title}` : '',
    meta.description ? `Meta description: ${meta.description}` : '',
    'Page content:',
    bodyText,
  ].filter(Boolean).join('\n');

  const client = getOpenAIClient();
  if (!client) {
    return {
      name: meta.title, type: '', city: '', phone: '', email: '',
      services: [], usps: [], tagline: meta.description,
      brief: [meta.title, meta.description].filter(Boolean).join('. '),
    };
  }

  const response = await client.chat.completions.create({
    model:           'gpt-4o-mini',
    max_tokens:      700,
    temperature:     0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: EXTRACT_PROMPT },
      { role: 'user',   content: fullText },
    ],
  });

  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content ?? '{}') as ScrapedBusiness;
    return {
      name:     parsed.name     ?? meta.title,
      type:     parsed.type     ?? '',
      city:     parsed.city     ?? '',
      phone:    parsed.phone    ?? '',
      email:    parsed.email    ?? '',
      services: Array.isArray(parsed.services) ? parsed.services.slice(0, 8) : [],
      usps:     Array.isArray(parsed.usps)     ? parsed.usps.slice(0, 4)     : [],
      tagline:  parsed.tagline  ?? meta.description,
      brief:    parsed.brief    ?? [meta.title, meta.description].filter(Boolean).join('. '),
    };
  } catch {
    return {
      name: meta.title, type: '', city: '', phone: '', email: '',
      services: [], usps: [], tagline: meta.description,
      brief: [meta.title, meta.description].filter(Boolean).join('. '),
    };
  }
}
