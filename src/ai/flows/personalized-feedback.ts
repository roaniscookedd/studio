// src/ai/flows/personalized-feedback.ts
'use server';
/**
 * @fileOverview A flow to generate personalized feedback based on user's cognitive assessment scores.
 *
 * - generatePersonalizedFeedback - A function that generates personalized feedback based on cognitive assessment scores.
 * - PersonalizedFeedbackInput - The input type for the generatePersonalizedFeedback function.
 * - PersonalizedFeedbackOutput - The return type for the generatePersonalizedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFeedbackInputSchema = z.object({
  scores: z.object({
    memory: z.number().describe('The memory score of the user.'),
    attention: z.number().describe('The attention score of the user.'),
    reasoning: z.number().describe('The reasoning score of the user.'),
  }).describe('The cognitive assessment scores of the user.'),
});
export type PersonalizedFeedbackInput = z.infer<typeof PersonalizedFeedbackInputSchema>;

const PersonalizedFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The personalized feedback for the user.'),
  recommendations: z.string().describe('The personalized recommendations for the user.'),
});
export type PersonalizedFeedbackOutput = z.infer<typeof PersonalizedFeedbackOutputSchema>;

export async function generatePersonalizedFeedback(input: PersonalizedFeedbackInput): Promise<PersonalizedFeedbackOutput> {
  return personalizedFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFeedbackPrompt',
  input: {schema: PersonalizedFeedbackInputSchema},
  output: {schema: PersonalizedFeedbackOutputSchema},
  prompt: `You are an AI assistant that provides personalized feedback and recommendations based on cognitive assessment scores.

  Scores:
  Memory: {{{scores.memory}}}
  Attention: {{{scores.attention}}}
  Reasoning: {{{scores.reasoning}}}

  Provide personalized feedback to the user based on their scores, highlighting their strengths and weaknesses.
  Also, provide personalized recommendations for areas of improvement.
  Be encouraging and supportive.

  Your response should include both feedback and recommendations.
  Feedback:
  <feedback>

  Recommendations:
  <recommendations>
  `,
});

const personalizedFeedbackFlow = ai.defineFlow(
  {
    name: 'personalizedFeedbackFlow',
    inputSchema: PersonalizedFeedbackInputSchema,
    outputSchema: PersonalizedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
