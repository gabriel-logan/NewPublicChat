import { Controller, Get } from "@nestjs/common";

@Controller("ping")
export class PingController {
	@Get()
	public ping(): string {
		return "pong";
	}
}
