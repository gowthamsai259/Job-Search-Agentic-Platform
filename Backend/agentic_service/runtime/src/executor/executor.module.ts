import { Module } from "@nestjs/common";
import { ToolExecutor } from "./tool.executor";
import { SearchJobsModule } from "../tools/search-jobs/search-jobs.module";

@Module({
    imports: [SearchJobsModule],
    providers: [ToolExecutor],
    exports: [ToolExecutor],
})
export class ExecutorModule {}