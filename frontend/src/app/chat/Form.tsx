"use client";

import { useEffect, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { Socket } from "socket.io-client";

import { Message } from "@/types/chat";

interface FormProps {
	socketRef: React.MutableRefObject<Socket | null>;
	name: string;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function Form({ socketRef, name, setMessages }: FormProps) {
	const [typing, setTyping] = useState(false);
	const [whoIsTyping, setWhoIsTyping] = useState("");

	const [count, setCount] = useState(0);

	const [message, setMessage] = useState("");

	const sendMessage = (
		event:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		if (event instanceof KeyboardEvent) {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
			} else {
				return;
			}
		} else {
			event.preventDefault();
		}

		if (!message.trim()) {
			alert("You can't send an empty message.");
			return;
		}

		if (message.length > 1000) {
			alert("You can't send a message with more than 1000 characters.");
			return;
		}

		const socketExist: Socket | null = socketRef.current;

		if (socketExist) {
			socketExist.emit(
				"createMessage",
				{
					name,
					text: message,
					date: new Date()
						.toLocaleTimeString("en-US", {
							timeStyle: "short",
						})
						.toString(),
				},
				(response: Message) => {
					setMessage("");
					setCount(0);
				},
			);
		}
	};

	const emitTyping = () => {
		const socketExist: Socket | null = socketRef.current;
		if (socketExist) {
			socketExist.emit("typing", { isTyping: true });
			setTimeout(() => {
				if (socketExist) {
					socketExist.emit("typing", { isTyping: false });
				}
			}, 2000);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const textarea = event.target;
		textarea.style.height = "auto";
		textarea.style.height = textarea.scrollHeight + "px";
		setMessage(event.target.value);
		setCount(event.target.value.length);
		emitTyping();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (isMobile) {
			return;
		}
		if (event.key === "Enter" && !event.shiftKey) {
			sendMessage(event);
		}
	};

	// This useEffect handles the messages and typing events
	useEffect(() => {
		const handleTyping = (data: { name: string; isTyping: boolean }) => {
			if (data.name !== name) {
				// Ignore typing events from the current user
				setTyping(data.isTyping);

				if (data.isTyping) {
					setWhoIsTyping(data.name);
				} else {
					setWhoIsTyping("");
				}
			}
		};

		const socket: Socket | null = socketRef.current;

		const handleNewMessage = (message: Message) => {
			setMessages((prev) => [...prev, message]);
		};

		if (socket) {
			socket.on("typing", handleTyping);

			socket.emit("findAllMessages", {}, (response: Message[]) => {
				setMessages(response);
			});

			socket.on("newMessage", handleNewMessage);
		}

		// Limpeza ao desmontar
		return () => {
			if (socket) {
				socket.off("newMessage", handleNewMessage);
				socket.off("typing", handleTyping);
			}
		};
	}, [name, setMessages, socketRef]);

	return (
		<form className="flex flex-col p-2 bg-white">
			<div className="flex justify-between mb-2">
				<p className="text-black mr-4">
					<span className={`${count > 999 ? "text-red-500" : "text-black"}`}>
						{count > 999 ? "Max" : count}
					</span>{" "}
					/ 1000 characters.
				</p>
				<span className="text-black ml-4">
					{typing ? `${whoIsTyping} is typing...` : ""}
				</span>
			</div>

			<div className="flex">
				<textarea
					value={message}
					maxLength={1000}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					className="flex-grow p-2 border rounded-lg min-h-16 text-black max-h-28 overflow-auto resize-none"
					placeholder="Type a message..."
					disabled={!socketRef.current}
				/>

				<button
					onClick={sendMessage}
					disabled={
						message.length > 1000 || !message.trim() || !socketRef.current
					}
					className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg active:bg-green-700 transition duration-150 ease-in-out"
				>
					<IoSendSharp color="white" size={32} />
				</button>
			</div>
		</form>
	);
}
