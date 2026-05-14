import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/main";

let server;

async function bootstrapServer() {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    await app.init();
    server = app.getHttpAdapter().getInstance();
  }

  return server;
}

export default async function handler(req, res) {
  const app = await bootstrapServer();
  return app(req, res);
}
