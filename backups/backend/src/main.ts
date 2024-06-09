import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";

type App = NestExpressApplication;

async function bootstrap(): Promise<void> {
	const app: App = await NestFactory.create<App>(AppModule);

	await app.listen(3000);
}
bootstrap();
