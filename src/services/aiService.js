import { buildPrompt, getFallbackResponse } from '../utils/promptEngine';

// Set to true to enable external API (requires VITE_OPENAI_KEY)
const USE_EXTERNAL_API = false;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateAIResponse(userMessage, context, { signal } = {}) {
  if (USE_EXTERNAL_API && import.meta.env.VITE_OPENAI_KEY) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: buildPrompt(userMessage, context),
          max_tokens: 200,
          temperature: 0.7,
        }),
        signal,
      });
      if (response.ok) {
        const data = await response.json();
        const reply = data.choices[0].message.content;
        return {
          reply,
          suggestions: extractSuggestions(reply),
          updatedContext: { lastIntent: 'api' },
        };
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
    }
  }

  return getFallbackResponse(userMessage, context);
}

function extractSuggestions(text) {
  const suggestions = [];
  if (text.includes('GPA')) suggestions.push('How to improve GPA?');
  if (text.includes('CGPA')) suggestions.push('Explain CGPA calculation');
  if (text.includes('export')) suggestions.push('Export guide');
  if (text.includes('currency')) suggestions.push('Currency converter help');
  if (suggestions.length === 0) suggestions.push('Help with GPA', 'Study tips');
  return suggestions.slice(0, 3);
}