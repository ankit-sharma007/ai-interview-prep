import {genkit} from 'genkit';
import {z} from 'zod';

async function post<I, O>(
  url: string,
  body: I,
  headers: Record<string, string>
): Promise<O> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
  }

  return (await response.json()) as O;
}

export const ai = genkit({
  plugins: [],
});

const OpenRouterResponseSchema = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    })
  ),
});

export const openrouterTool = ai.defineTool(
  {
    name: 'openrouter',
    description: 'A tool to interact with the OpenRouter API.',
    inputSchema: z.object({
      model: z.string(),
      messages: z.array(z.any()),
    }),
    outputSchema: OpenRouterResponseSchema,
  },
  async (input) => {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    return await post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: input.model,
        messages: input.messages,
        stream: false,
      },
      {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      }
    );
  }
);
