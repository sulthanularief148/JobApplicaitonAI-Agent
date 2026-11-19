// Gemini AI Provider — implements the AIProvider interface using Google's Gemini API.
// Uses the model name from the GEMINI_MODEL env var (defaults to gemini-2.0-flash).

import type { AIProvider } from './provider';
import type { AnalysisResponse } from '@/lib/validators/analysis';
import { parseAnalysisResponse } from '@/lib/validators/analysis';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.apiKey = apiKey;
    this.model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  }

  async analyze(cvText: string, jobDescription: string): Promise<AnalysisResponse> {
    const userPrompt = buildUserPrompt(cvText, jobDescription);

    // First attempt
    const firstResponse = await this.callGemini(userPrompt);
    const firstParse = parseAnalysisResponse(firstResponse);

    if (firstParse.success) {
      return firstParse.data;
    }

    // Retry once with the validation error included
    const retryPrompt = `${userPrompt}

IMPORTANT: Your previous response was invalid. Error: ${firstParse.error}
Please fix the response and return ONLY valid JSON matching the schema exactly.`;

    const retryResponse = await this.callGemini(retryPrompt);
    const retryParse = parseAnalysisResponse(retryResponse);

    if (retryParse.success) {
      return retryParse.data;
    }

    throw new Error(
      `AI returned invalid data after retry. Error: ${retryParse.error}`
    );
  }

  private async callGemini(userPrompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const body = JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });

    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.status === 503 && attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Gemini returned an empty response');
      }

      return text;
    }

    throw new Error('Gemini API unavailable after retries');
  }
}
