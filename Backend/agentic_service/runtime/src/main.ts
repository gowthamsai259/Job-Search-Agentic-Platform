import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    credentials: true,
  });

  await app.listen(3001);

  console.log("🚀 Agent Runtime is running on http://localhost:3001");
}

bootstrap();