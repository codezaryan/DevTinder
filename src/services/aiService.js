const generateResponse = async (prompt) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    console.log("Generating response for prompt:", prompt);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Groq response received");
    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Groq Error:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error('Failed to generate response: ' + error.message);
  }
};

module.exports = { generateResponse };

