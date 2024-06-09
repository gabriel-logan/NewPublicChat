import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ChatModule } from "./chat/chat.module";
import appConfig from "./configs/app.config";
import { PingModule } from "./ping/ping.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [appConfig], // Load environment variables
		}),
		ChatModule,
		PingModule,
	],
})
export class AppModule {}
