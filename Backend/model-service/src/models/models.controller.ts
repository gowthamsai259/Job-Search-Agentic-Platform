import {
    Body,
    Controller,
    Post,
  } from "@nestjs/common";
  
  import { ModelsService } from "./models.service";
  import { ValidateKeyDto } from "./models.dto";
  
  @Controller("models")
  export class ModelsController {
  
    constructor(
      private readonly modelsService: ModelsService,
    ) {}
  
    @Post("validate")
    async validateApiKey(
      @Body() body: ValidateKeyDto,
    ) {
  
      return await this.modelsService.validateApiKey(
        body.apiKey,
      );
  
    }
  
  }