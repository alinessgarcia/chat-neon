import OpenAI from "openai";

// Inicializa o cliente da OpenAI apontando para a API da DeepSeek
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY, // Usando a nova variável de ambiente
});

export default async function handler(req, res) {
  // Permite apenas requisições POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { message } = req.body;

  // Validação da mensagem
  if (!message) {
    return res.status(400).json({ error: { message: 'A mensagem é obrigatória.' } });
  }

  // Verifica se a API key está configurada no servidor
  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: { message: 'A chave da API não está configurada no servidor.' } });
  }

  try {
    // Faz a chamada para a API da DeepSeek
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat", // Modelo especificado pela DeepSeek
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ],
      stream: false, // Mantendo como no código original
    });

    // Retorna a resposta da API para o frontend
    res.status(200).json(completion);

  } catch (error) {
    // Tratamento de erro melhorado
    console.error('DeepSeek API error:', error);
    res.status(error.status || 500).json({ error: { message: error.message || 'Ocorreu um erro ao se comunicar com a API.' } });
  }
}
