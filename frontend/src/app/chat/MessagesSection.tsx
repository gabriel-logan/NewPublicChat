"use client";

import { Fragment, useEffect, useRef } from "react";

import { Message } from "@/types/chat";

interface MessagesSectionProps {
	messages: Message[];
}

export default function MessagesSection({ messages }: MessagesSectionProps) {
	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	// This useEffect handles the scroll to the bottom of the chat
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex-1 flex flex-col overflow-y-auto p-2 space-y-2">
			{messages.map((msg, index) => {
				return (
					<div
						key={index}
						className={`${
							msg.name === (localStorage.getItem("name") as string)
								? "self-end bg-green-500 text-white rounded-l-lg rounded-tr-lg"
								: "self-start bg-white text-black rounded-r-lg rounded-tl-lg"
						} p-2 max-w-90% sm:max-w-80% md:max-w-lg min-w-36 font-medium`}
					>
						{msg.name}:{" "}
						<span style={{ wordWrap: "break-word" }}>
							{msg.text.split("\n").map((line, index) => (
								<Fragment key={index}>
									{line}
									<br />
								</Fragment>
							))}
						</span>
						<span className="inline-block opacity-65 ml-2 relative top-2 text-sm">
							{msg.date
								? msg.date
								: new Date().toLocaleTimeString("en-US", {
										timeStyle: "short",
									})}
						</span>
					</div>
				);
			})}
			<div ref={messagesEndRef} />
		</div>
	);
}
