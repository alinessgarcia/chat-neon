const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;
  const MODEL = "deepseek/deepseek-r1:free";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: message }],
        stream: false
      })
    });
    const data = await response.json();
    console.log('OpenRouter API Response:', data); // Log para depuração
    if (response.ok && data.choices && data.choices.length > 0) {
      res.json(data);
    } else {
      // Se a resposta não for ok ou não tiver choices, repassa o erro
      res.status(response.status || 500).json(data.error || { message: 'An unknown error occurred' });
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
