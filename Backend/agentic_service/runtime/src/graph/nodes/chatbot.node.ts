import OpenAI from "openai";
import { AgentStateType } from "../state";

const openai = new OpenAI({
  apiKey: "your key",
});

export async function chatbotNode(
  state: AgentStateType,
) {

  const completion = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    temperature: 0,

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content: `
You are a supervisor agent.

Your responsibility is ONLY to decide which agent should handle the user's request.

Available agents:

1. job_search
   - Search jobs

Return JSON only.

Example:

{
    "agent":"job_search",
    "tool":"search_jobs"
}
        `,
      },

      {
        role: "user",
        content: state.message,
      },
    ],
  });

  const decision = JSON.parse(
    completion.choices[0].message.content ?? "{}",
  );

  return {

    selectedAgent: decision.agent,

    tool: decision.tool,

    toolInput: {
      query: state.message,
    },

  };

}