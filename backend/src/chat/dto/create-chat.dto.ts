import { IsString, Length } from "class-validator";

export class CreateChatDto {
	@IsString()
	@Length(1, 100)
	public readonly name!: string;

	@IsString()
	@Length(1, 1000)
	public readonly text!: string;

	@IsString()
	@Length(1, 20)
	public readonly date: string = new Date()
		.toLocaleTimeString("en-US", {
			timeStyle: "short",
		})
		.toString();
}
