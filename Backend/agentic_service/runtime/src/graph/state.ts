import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({

  // Original user query
  message: Annotation<string>(),

  // Which agent the supervisor selected
  selectedAgent: Annotation<string | undefined>(),

  // Tool name (optional)
  tool: Annotation<string | undefined>(),

  // Input to the tool
  toolInput: Annotation<any>(),

  // Raw output from the tool
  toolOutput: Annotation<any>(),

  // Final response returned to the UI
  finalAnswer: Annotation<any>(),

});

export type AgentStateType = typeof AgentState.State;