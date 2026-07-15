import { Injectable } from "@nestjs/common";

import { createGraph } from "../graph/graph";

@Injectable()
export class AgentService {

  private readonly graph = createGraph();

  async chat(
    message: string,
  ) {

    const result = await this.graph.invoke({

      message,

    });
    console.log(result);

    return result.finalAnswer;

  }

}