import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

import { AgentService } from "../agent/agent.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class AgentGateway {

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly agentService: AgentService,
  ) {}

  handleConnection(client: Socket) {
    console.log("Connected:", client.id);
  }

  handleDisconnect(client: Socket) {
    console.log("Disconnected:", client.id);
  }

  @SubscribeMessage("chat")
  async chat(

    @MessageBody() body: { message: string },

    @ConnectedSocket() client: Socket,

  ) {

    const response =
      await this.agentService.chat(
        body.message,
      );

    client.emit("agent_event", {

      type: "assistant_message",

      data: response,

    });

  }

}