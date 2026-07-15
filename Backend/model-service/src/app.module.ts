import { ModelsModule } from "./models/models.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ModelsModule,
    // other modules...
  ],
})
export class AppModule {}