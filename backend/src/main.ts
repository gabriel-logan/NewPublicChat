import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";

type App = NestExpressApplication;

async function bootstrap(): Promise<void> {
	const app: App = await NestFactory.create<App>(AppModule);

	const logger: Logger = new Logger();

	const configService: ConfigService = app.get(ConfigService);

	const port: number = configService.get("port") as number;

	await app.listen(port, () => {
		logger.log(`Server is running on http://localhost:${port}`);
	});
}

bootstrap();
