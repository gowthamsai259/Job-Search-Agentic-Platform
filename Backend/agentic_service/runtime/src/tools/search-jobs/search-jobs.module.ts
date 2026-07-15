import { Module } from "@nestjs/common";
import { SearchJobsTool } from "./search-jobs.tool";

@Module({
    providers: [SearchJobsTool],
    exports: [SearchJobsTool],
})
export class SearchJobsModule {}