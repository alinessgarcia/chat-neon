 export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { message } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;
  const MODEL = "deepseek/deepseek-r1:free";

  if (!API_KEY) {
    return res.status(500).json({ message: 'API key não configurada.' });
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
      const errorMessage = data.error?.message || 'Erro na resposta da API';
      return res.status(response.status).json({ message: errorMessage });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

