import { ValidationPipe } from "@nestjs/common";
import type {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
} from "@nestjs/websockets";
import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Message } from "./entities/message.entity";

@WebSocketGateway({
	cors: {
		origin: "https://chat-client-lilac.vercel.app/", // Allow all origins
	},
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private readonly server!: Server;

	private readonly connectedClients: Map<string, number> = new Map();

	constructor(private readonly chatService: ChatService) {}

	public handleConnection(@ConnectedSocket() client: Socket): void {
		this.connectedClients.set(client.id, 1);

		this.server.emit("clientsTotal", this.connectedClients.size);
	}

	public handleDisconnect(@ConnectedSocket() client: Socket): void {
		this.connectedClients.delete(client.id);

		this.server.emit("clientsTotal", this.connectedClients.size);
	}

	public afterInit(server: Server): void {
		setInterval(() => {
			this.server.emit("newMessage", {
				name: "Bot",
				text: "This message will be sent every 3 minutes.",
				date: new Date()
					.toLocaleTimeString("en-US", {
						timeStyle: "short",
					})
					.toString(),
			});
		}, 3 * 60000); // 3 minutes
	}

	@SubscribeMessage("createMessage")
	public create(
		@MessageBody(ValidationPipe) createChatDto: CreateChatDto,
	): Message {
		const message: Message = this.chatService.create(createChatDto);

		this.server.emit("newMessage", message);

		return message;
	}

	@SubscribeMessage("findAllMessages")
	public findAll(): Message[] {
		return this.chatService.findAll();
	}

	@SubscribeMessage("join")
	public joinRoom(
		@MessageBody("name") name: string,
		@ConnectedSocket() client: Socket,
	): string[] {
		return this.chatService.identify(name, client.id);
	}

	@SubscribeMessage("typing")
	public async typing(
		@MessageBody("isTyping") isTyping: boolean,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		const name: string = await this.chatService.getClientName(client.id);

		client.broadcast.emit("typing", { name, isTyping });
	}
}
