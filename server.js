import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;
  const MODEL = "deepseek/deepseek-r1:free";

  if (!API_KEY) {
    return res.status(500).json({ error: { message: 'API key is not configured on the server.' } });
  }

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

    if (!response.ok) {
      console.error('OpenRouter API Error:', data);
      // Repassa a mensagem de erro da API, se disponível
      const errorMessage = data.error?.message || 'Failed to get response from AI';
      return res.status(response.status).json({ error: { message: errorMessage } });
    }

    res.json(data);
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    res.status(500).json({ error: { message: 'An internal server error occurred.' } });
  }
});

// Rota para servir o index.html para qualquer outra requisição
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
