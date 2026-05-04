import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from '../src/app.module';

type ServerHandler = (req: IncomingMessage, res: ServerResponse) => void;

let cachedServer: ServerHandler | null = null;

async function bootstrapServer(): Promise<ServerHandler> {
  if (cachedServer) {
    return cachedServer;
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.init();

  const server = app.getHttpAdapter().getInstance() as ServerHandler;
  cachedServer = server;

  return server;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const server = await bootstrapServer();

  return server(req, res);
}
