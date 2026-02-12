'use server';
/**
 * @fileOverview An AI flow to suggest an optimal sales route based on prospect data.
 *
 * - suggestRoute - A function that analyzes prospects to suggest a route.
 * - SuggestRouteInput - The input type for the suggestRoute function.
 * - SuggestRouteOutput - The return type for the suggestRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define the schema for a single prospect within the input
const ProspectSchemaForRoute = z.object({
  id: z.string(),
  address: z.string(),
  status: z.string(), // a ProspectStatus enum, but string is fine for the schema
  potentialValue: z.number().optional().default(0),
});

// Define the input schema for the flow
const SuggestRouteInputSchema = z.object({
  prospects: z.array(ProspectSchemaForRoute),
});
export type SuggestRouteInput = z.infer<typeof SuggestRouteInputSchema>;

// Define the output schema for the flow
const SuggestRouteOutputSchema = z.object({
  prospectIds: z.array(z.string()).describe("An array of the unique string IDs of the prospects recommended for the route."),
  prospectCount: z.number().describe("The total number of prospects in the suggested cluster."),
  estimatedKm: z.number().describe("A rough estimate of the total travel distance in kilometers to visit all prospects in the cluster."),
  totalPotentialValue: z.number().describe("The sum of the 'potentialValue' for all prospects in the suggested route."),
});
export type SuggestRouteOutput = z.infer<typeof SuggestRouteOutputSchema>;

// Export a wrapper function to be called from the UI
export async function suggestRoute(input: SuggestRouteInput): Promise<SuggestRouteOutput> {
  return suggestRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRoutePrompt',
  input: { schema: SuggestRouteInputSchema },
  output: { schema: SuggestRouteOutputSchema },
  prompt: `You are an expert logistics and sales route optimizer for a wholesale food distributor in Chicago. You will be given a JSON list of sales prospects. Each prospect has an ID, an address, a current sales 'status' (like 'pending', 'visited', 'client'), and a 'potentialValue' in USD.

Your primary goal is to identify a single, optimal cluster of prospects for a salesperson to visit in one trip. This cluster should represent the most efficient and valuable route possible.

Follow these criteria strictly:
1.  **Geographic Density:** The prospects in the cluster must be geographically close to each other to minimize travel time. Think of a tight group on a map.
2.  **High Value:** The combined 'potentialValue' of the prospects in the cluster should be as high as possible. A high-value route is better than a low-value one, even if slightly less dense.
3.  **Sales Funnel Stage:** You MUST prioritize prospects that are NOT yet 'client'. Prospects with 'pending' or 'visited' status are high priority. You can include 'client' prospects ONLY if they are geographically essential to forming a dense, logical route between higher-priority prospects, but they should not be the primary focus.
4.  **Route Size:** The ideal route size is between 5 and 15 prospects. Do not create a route that is too small or too large.

Analyze all the provided prospects and return ONLY a JSON object matching the output schema with your single best route recommendation. The 'prospectIds' array should contain the string IDs of the prospects in your recommended cluster. 'estimatedKm' should be a rough estimate of the total travel distance in kilometers for the route. 'prospectCount' is the number of prospects in the cluster. 'totalPotentialValue' is the sum of their potential values.

Here are the prospects:
{{{json prospects}}}
`,
});

const suggestRouteFlow = ai.defineFlow(
  {
    name: 'suggestRouteFlow',
    inputSchema: SuggestRouteInputSchema,
    outputSchema: SuggestRouteOutputSchema,
  },
  async (input) => {
    // In a more advanced implementation, we could pre-process data here,
    // like geocoding addresses if they don't have lat/lng.
    // For now, we'll rely on the model's ability to interpret addresses.
    const { output } = await prompt(input);
    
    // The prompt is very specific to return the JSON object, so output should exist.
    // A null check is still good practice.
    if (!output) {
      throw new Error("The AI model did not return a valid route suggestion.");
    }
    
    return output;
  }
);
