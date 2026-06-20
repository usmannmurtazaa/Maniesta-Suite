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
  if ((lowerMsg.includes('gpa') || lowerMsg.includes('grade point average')) && (page === 'gpa' || page === 'dashboard' || page === 'home')) {
    return {
      reply: `**GPA Calculation**\n• GPA = total quality points ÷ total credit hours\n• Each letter grade has a point value (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)\n• Your last GPA: ${lastGPA || '–'}\n\n**Next step:** Use the Target GPA calculator to plan future grades.\n\n**Pro tip:** Focus on courses with higher credit hours – they impact your GPA more.`,
      suggestions: ['How to improve GPA?', 'Explain CGPA', 'Set target GPA'],
      updatedContext: { lastIntent: 'gpa' },
    };
  }

  if (lowerMsg.includes('cgpa') || lowerMsg.includes('cumulative gpa')) {
    return {
      reply: `**CGPA (Cumulative GPA)**\n• Average of all semester GPAs\n• Formula: (GPA₁ + GPA₂ + ...) ÷ number of semesters\n• Weighted CGPA: (GPA₁×Credits₁ + ...) ÷ total credits\n\n**Want to raise your CGPA?** Focus on high‑credit courses and aim for consistent improvement each semester.`,
      suggestions: ['How to calculate CGPA', 'GPA vs CGPA', 'Improve CGPA'],
      updatedContext: { lastIntent: 'cgpa' },
    };
  }

  if (lowerMsg.includes('export') || lowerMsg.includes('pdf') || lowerMsg.includes('csv') || lowerMsg.includes('report')) {
    return {
      reply: `**Exporting Reports**\n1. Calculate GPA or CGPA\n2. Click "Export Academic Record"\n3. Fill your details (name, ID, degree, etc.)\n4. Generate PDF & CSV\n\nThe PDF includes a professional course table, GPA/CGPA, academic standing, and timestamp – perfect for scholarships or job applications.`,
      suggestions: ['What’s in the PDF?', 'How to open CSV?', 'Export guide'],
      updatedContext: { lastIntent: 'export' },
    };
  }

  if ((lowerMsg.includes('currency') || lowerMsg.includes('exchange rate')) && (toolActive === 'currency' || page === 'currencyconverter')) {
    return {
      reply: `**Currency Converter**\n• Enter the amount\n• Select "From" and "To" currencies from the dropdown\n• Rates update automatically (cached for 24h)\n• Use the swap button ⇄ to reverse currencies instantly\n\n**Tip:** Tap the result to copy it to your clipboard.`,
      suggestions: ['Convert USD to EUR', 'Update rates', 'Accuracy of rates'],
      updatedContext: { lastIntent: 'currency' },
    };
  }

  if (lowerMsg.includes('interest') || lowerMsg.includes('loan') || lowerMsg.includes('emi')) {
    return {
      reply: `**Interest Calculator**\n• **Simple Interest:** I = P × r × t\n• **Compound Interest:** A = P(1 + r/n)^(nt)\n• **Loan EMI:** Monthly payment for fixed‑rate loans\n\nChoose your mode, fill in the values, and click "Calculate". Results update instantly.`,
      suggestions: ['Calculate compound interest', 'What is EMI?', 'Interest guide'],
      updatedContext: { lastIntent: 'interest' },
    };
  }

  if (lowerMsg.includes('unit') || lowerMsg.includes('convert length') || lowerMsg.includes('convert weight')) {
    return {
      reply: `**Unit Converter**\n• Select a category (length, weight, temperature, etc.)\n• Choose "From" and "To" units\n• Enter a value – conversion happens instantly\n• Use the swap button to reverse units\n\nSupports 7 categories with 150+ unit combinations.`,
      suggestions: ['Convert km to miles', 'Convert °C to °F', 'Unit converter guide'],
      updatedContext: { lastIntent: 'unit' },
    };
  }

  if (page === 'dashboard') {
    return {
      reply: `**Your Dashboard**\n• Recent GPA: ${lastGPA || 'not yet'}\n• Quick actions: GPA Calculator, Export Report, Currency Converter\n• Star your favourite tools for instant access\n\nNeed help with a specific tool? Just ask me.`,
      suggestions: ['Calculate GPA', 'Export report', 'Study tips'],
      updatedContext: { lastIntent: 'dashboard' },
    };
  }

  // Default fallback – concise and helpful
  return {
    reply: `I'm here to help with GPA, CGPA, exports, currency conversion, interest, and unit conversion. Pick a topic:\n\n• "How to calculate GPA?"\n• "Explain CGPA"\n• "Currency converter help"\n• "Export guide"\n• "Interest calculator"`,
    suggestions: ['How to calculate GPA?', 'Explain CGPA', 'Currency converter help', 'Export guide'],
    updatedContext: {},
  };
}