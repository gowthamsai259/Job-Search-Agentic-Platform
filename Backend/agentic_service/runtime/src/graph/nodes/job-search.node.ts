import OpenAI from "openai";

import { AgentStateType } from "../state";
import { SearchJobsTool } from "../../tools/search-jobs/search-jobs.tool";

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: "your key"
});

const searchJobsTool = new SearchJobsTool();

export async function jobSearchNode(
  state: AgentStateType,
) {

  // Step 1 - Execute Tool
  const jobs = await searchJobsTool.execute({
    query: state.message,
  });

  // Step 2 - Ask the LLM to filter the jobs
  const completion =
    await openai.chat.completions.create({

      model: "gpt-4.1-mini",

      temperature: 0,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are a Job Search AI Agent.

You receive:

1. User Query
2. List of Jobs

Your task is:

- Understand the user's intent.
- Remove irrelevant jobs.
- Rank the remaining jobs.
- Return ONLY JSON.

Format:

{
  "message": "...",
  "jobs": [
    {
      "title": "",
      "company": "",
      "location": "",
      "type": "",
      "salary": "",
      "applyUrl": ""
    }
  ]
}
          `,
        },

        {
          role: "user",
          content: JSON.stringify({
            query: state.message,
            jobs,
          }),
        },
      ],
    });

  const result = JSON.parse(
    completion.choices[0].message.content ?? "{}",
  );

  return {

    toolOutput: jobs,

    finalAnswer: result,

  };

}