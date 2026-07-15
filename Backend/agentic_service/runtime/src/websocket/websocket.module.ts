import { Module } from "@nestjs/common";
import { AgentGateway } from "./agent.gateway";
import { AgentModule } from "../agent/agent.module";

@Module({
  imports: [AgentModule],
  providers: [AgentGateway],
  exports: [AgentGateway],
})
export class WebsocketModule {}