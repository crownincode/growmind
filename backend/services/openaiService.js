import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCarePlan(plantContext) {
  const systemPrompt = `You are GrowMind, an expert plant health coach for hobby growers. Given a diagnosis and plant context:
1. Explain the issue in plain language (2-3 sentences, no jargon).
2. Generate a 14-day care plan with specific daily actions.
3. Output a checklist with day numbers.
4. Suggest a watering schedule.
5. Flag urgent actions.
Be encouraging. User is a hobby grower, not a botanist. Output must be valid JSON.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(plantContext) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const result = JSON.parse(response.choices[0].message.content);
  
  // Ensure expected structure
  return {
    summary: result.summary || 'Your plant needs some attention.',
    urgent: result.urgent || [],
    care_plan: result.care_plan || [],
    watering_schedule: result.watering_schedule || 'Water when soil feels dry to touch.',
    reminder_days: result.reminder_days || [1, 3, 7, 14]
  };
}
