import { Injectable, UnauthorizedException } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class ModelsService {

  async validateApiKey(apiKey: string) {

    try {

      const client = new OpenAI({
        apiKey,
      });

      const response = await client.models.list();

      const models = response.data
        .map(model => model.id)
        .sort();

      return {
        success: true,
        models,
      };

    } catch (error: any) {

      if (error.status === 401) {
        throw new UnauthorizedException("Invalid OpenAI API Key");
      }

      throw new UnauthorizedException(
        error?.message ?? "Unable to validate API Key",
      );

    }

  }

}