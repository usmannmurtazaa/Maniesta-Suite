// src/utils/promptEngine.js
export function buildPrompt(userMessage, context) {
  const { page, lastGPA, toolActive, messages } = context;
  const system = `You are Maniesta AI, an academic assistant for students. 
Current page: ${page || 'unknown'}. 
Last GPA: ${lastGPA || 'not calculated'}.
Active tool: ${toolActive || 'none'}.
Keep answers short, use bullet points, suggest next actions.`;
  return [{ role: 'system', content: system }, ...messages.slice(-5), { role: 'user', content: userMessage }];
}

export function getFallbackResponse(userMessage, context) {
  const lowerMsg = userMessage.toLowerCase();
  const { page, lastGPA, toolActive } = context;

  // GPA help
  if (lowerMsg.includes('gpa') && (page === 'gpa' || page === 'dashboard')) {
    return {
      reply: `**GPA Calculation**\n• GPA = total quality points ÷ total credit hours\n• Each letter grade has a point value (A=4.0, B=3.0...)\n• Your last GPA: ${lastGPA || '–'}\n\n**Next step:** Use the Target GPA calculator to plan future grades.`,
      suggestions: ['How to improve GPA?', 'Explain CGPA', 'Set target GPA'],
      updatedContext: { lastIntent: 'gpa' },
    };
  }

  // CGPA help
  if (lowerMsg.includes('cgpa')) {
    return {
      reply: `**CGPA (Cumulative GPA)**\n• Average of all semester GPAs\n• Formula: (GPA₁ + GPA₂ + ...) ÷ number of semesters\n• Weighted CGPA: (GPA₁×Credits₁ + ...) ÷ total credits\n\n**Want to raise your CGPA?** Focus on high‑credit courses.`,
      suggestions: ['How to calculate CGPA', 'GPA vs CGPA', 'Improve CGPA'],
      updatedContext: { lastIntent: 'cgpa' },
    };
  }

  // Export help
  if (lowerMsg.includes('export') || lowerMsg.includes('pdf') || lowerMsg.includes('csv')) {
    return {
      reply: `**Exporting Reports**\n1. Calculate GPA or CGPA\n2. Click "Export Academic Record"\n3. Fill your details (name, ID, etc.)\n4. Generate PDF & CSV\n\nThe PDF includes course table, GPA, and academic standing.`,
      suggestions: ['What’s in the PDF?', 'How to open CSV?', 'Export guide'],
      updatedContext: { lastIntent: 'export' },
    };
  }

  // Currency help
  if (lowerMsg.includes('currency') && toolActive === 'currency') {
    return {
      reply: `**Currency Converter**\n• Enter amount\n• Select "From" and "To" currencies\n• Rates update automatically\n• Use the swap button to reverse currencies\n\nRates are cached for 1 hour to save API calls.`,
      suggestions: ['Convert USD to EUR', 'Update rates', 'Accuracy of rates'],
      updatedContext: { lastIntent: 'currency' },
    };
  }

  // Dashboard suggestions
  if (page === 'dashboard') {
    return {
      reply: `**Your Dashboard**\n• Recent GPA: ${lastGPA || 'not yet'}\n• Quick actions: GPA Calculator, Export Report\n• Star your favourite tools for quick access\n\nNeed help with a specific tool? Ask me!`,
      suggestions: ['Calculate GPA', 'Export report', 'Study tips'],
      updatedContext: {},
    };
  }

  // Default fallback
  return {
    reply: `I can help you with GPA/CGPA calculation, exporting reports, currency conversion, and study tips. What would you like to know?\n\n• "How to calculate GPA?"\n• "Explain CGPA"\n• "Currency converter help"\n• "Export guide"`,
    suggestions: ['How to calculate GPA?', 'Explain CGPA', 'Export guide'],
    updatedContext: {},
  };
}