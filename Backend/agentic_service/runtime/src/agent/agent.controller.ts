import { Body, Controller, Post } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { ChatDto } from "./dto/chat.dto";

@Controller("agent")
export class AgentController {

    constructor(
        private readonly agentService: AgentService,
    ) {}

    @Post("chat")
    async chat(
        @Body() chatDto: ChatDto,
    ) {

        return await this.agentService.chat(
            chatDto.message ?? '',
        );

    }

}