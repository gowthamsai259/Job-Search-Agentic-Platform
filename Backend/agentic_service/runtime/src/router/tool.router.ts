import {
    StateGraph,
    START,
    END,
  } from "@langchain/langgraph";
  
  import { AgentState } from "../graph/state";
  import { chatbotNode } from "../graph/nodes/chatbot.node";
  import { jobSearchNode } from "../graph/nodes/job-search.node";
  
  export function createGraph() {
  
    return new StateGraph(AgentState)
  
      .addNode("chatbot", chatbotNode)
  
      .addNode("tool", jobSearchNode)
  
      .addEdge(START, "chatbot")
  
      .addEdge("chatbot", "tool")
  
      .addEdge("tool", END)
  
      .compile();
  
  }