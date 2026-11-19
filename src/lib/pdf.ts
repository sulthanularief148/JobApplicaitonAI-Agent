// PDF text extraction using unpdf.
// Takes raw PDF bytes (from a file upload) and returns the plain text content.
// This runs on the server only — never in the browser.

import { extractText } from 'unpdf';

export async function extractPdfText(pdfBuffer: ArrayBuffer): Promise<string> {
  const { text } = await extractText(pdfBuffer);
  // text is an array of strings (one per page) — join them with newlines
  return text.join('\n').trim();
}
