export class Message {
	public readonly name!: string;
	public readonly text!: string;
	public readonly date: string = new Date()
		.toLocaleTimeString("en-US", {
			timeStyle: "short",
		})
		.toString();
}
