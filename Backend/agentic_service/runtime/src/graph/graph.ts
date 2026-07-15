import {
    StateGraph,
    START,
    END,
  } from "@langchain/langgraph";
  
  import { AgentState } from "./state";
  import { chatbotNode } from "./nodes/chatbot.node";
  import { jobSearchNode } from "./nodes/job-search.node";
  
  export function createGraph() {
  
    return new StateGraph(AgentState)
  
      .addNode("chatbot", chatbotNode)
  
      .addNode("job_search", jobSearchNode)
  
      .addEdge(START, "chatbot")
  
      .addEdge("chatbot", "job_search")
  
      .addEdge("job_search", END)
  
      .compile();
  
  }