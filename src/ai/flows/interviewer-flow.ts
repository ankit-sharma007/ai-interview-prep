'use server';

/**
 * @fileOverview A flow that acts as an AI interviewer, asking questions one by one.
 *
 * - chatWithInterviewer - A function that handles the conversation with the user.
 * - ChatWithInterviewerInput - The input type for the chatWithInterviewer function.
 * - ChatWithInterviewerOutput - The output type for the chatWithInterviewer function.
 */

import { ai, openrouterTool } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ChatWithInterviewerInputSchema = z.object({
  context: z.string().describe("The user's resume, job description, etc."),
  history: z.array(MessageSchema).describe('The conversation history.'),
  openRouterApiKey: z.string().describe('The OpenRouter API key.'),
  modelName: z.string().describe('The model name to use with OpenRouter.'),
});
export type ChatWithInterviewerInput = z.infer<
  typeof ChatWithInterviewerInputSchema
>;

const ChatWithInterviewerOutputSchema = z.object({
  response: z.string().describe("The AI interviewer's next question or response."),
});
export type ChatWithInterviewerOutput = z.infer<
  typeof ChatWithInterviewerOutputSchema
>;

export async function chatWithInterviewer(
  input: ChatWithInterviewerInput
): Promise<ChatWithInterviewerOutput> {
  return interviewerFlow(input);
}

const interviewerFlow = ai.defineFlow(
  {
    name: 'interviewerFlow',
    inputSchema: ChatWithInterviewerInputSchema,
    outputSchema: ChatWithInterviewerOutputSchema,
    tools: [openrouterTool],
  },
  async (input) => {
    process.env.OPENROUTER_API_KEY = input.openRouterApiKey;

    const systemPrompt = `You are an AI interviewer. Your goal is to conduct a job interview with the user based on the provided context.

Your instructions are:
1.  Ask one question at a time.
2.  After the user responds, ask a relevant follow-up question.
3.  Keep your responses conversational and natural, like a real interviewer.
4.  Do NOT add any extra formatting, labels (like "Interview Question:"), or internal notes (like "Answer expected:"). Just ask the question directly.
5.  If this is the start of the conversation, do not greet the user. Just ask your first question.

Context:
${input.context}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...input.history.map((msg) => ({ role: msg.role, content: msg.content })),
    ];

    const llmResponse = await openrouterTool({
      model: input.modelName,
      messages: messages,
    });
    
    const responseContent = llmResponse.choices[0].message.content;
    
    return {
        response: responseContent
    };
  }
);
