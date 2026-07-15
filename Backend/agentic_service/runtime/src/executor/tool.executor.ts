import { Injectable } from "@nestjs/common";
import { SearchJobsTool } from "../tools/search-jobs/search-jobs.tool";

@Injectable()
export class ToolExecutor {

    constructor(
        private readonly searchJobsTool: SearchJobsTool,
    ) {}

    async execute(
        toolName: string,
        input: any,
    ) {

        switch (toolName) {

            case "search_jobs":
                return await this.searchJobsTool.execute(input);

            default:
                throw new Error(`Unknown tool: ${toolName}`);

        }

    }

}