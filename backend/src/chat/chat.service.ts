import { Injectable } from "@nestjs/common";

import type { CreateChatDto } from "./dto/create-chat.dto";
import type { Message } from "./entities/message.entity";

@Injectable()
export class ChatService {
	public messages: Message[] = [
		{
			name: "Bot",
			text: "Hello!",
			date: new Date()
				.toLocaleTimeString("en-US", {
					timeStyle: "short",
				})
				.toString(),
		},
	];

	public readonly clientToUser: Record<string, string> = {};

	constructor() {
		setInterval(
			() => {
				this.messages = [
					{
						name: "Bot",
						text: "Hello! This is a new Chat",
						date: new Date()
							.toLocaleTimeString("en-US", {
								timeStyle: "short",
							})
							.toString(),
					},
				];
			},
			15 * 60 * 1000, // 15 minutes
		);
	}

	public create(createChatDto: CreateChatDto): Message {
		const message: Message = { ...createChatDto };

		this.messages.push(message);

		return message;
	}

	public findAll(): Message[] {
		return this.messages;
	}

	public getClientName(clientId: string): string {
		return this.clientToUser[clientId];
	}

	public identify(name: string, clientId: string): string[] {
		this.clientToUser[clientId] = name;

		return Object.values(this.clientToUser);
	}
}
