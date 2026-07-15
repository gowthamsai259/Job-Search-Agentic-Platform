import { Module } from "@nestjs/common";

import { AgentModule } from "./agent/agent.module";
import { ExecutorModule } from "./executor/executor.module";
import { WebsocketModule } from "./websocket/websocket.module";
import { SearchJobsModule } from "./tools/search-jobs/search-jobs.module";

@Module({
  imports: [
    AgentModule,
    ExecutorModule,
    WebsocketModule,
    SearchJobsModule,
  ],
})
export class AppModule {}