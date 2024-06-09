"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { FaCircle } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import io, { Socket } from "socket.io-client";

interface Message {
	name: string;
	text: string;
	date: string;
}

export default function ChatPage() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	const [name, setName] = useState("");

	const [typing, setTyping] = useState(false);
	const [whoIsTyping, setWhoIsTyping] = useState("");

	const [count, setCount] = useState(0);

	const [clientsTotal, setClientsTotal] = useState(0);

	const router = useRouter();

	const socketRef = useRef<Socket | null>(null);

	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	const sendMessage = (
		event:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (event instanceof KeyboardEvent) {
			if (event.key === "Enter" && !event.shiftKey && !isMobile) {
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

		if (socketRef.current) {
			socketRef.current.emit(
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
				},
			);
		}
	};

	const join = useCallback((value: string) => {
		(() => {
			if (socketRef.current) {
				socketRef.current.emit("join", { name: value });
			}
		})();
	}, []);

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
		if (event.key === "Enter" && !event.shiftKey) {
			sendMessage(event);
		}
	};

	// This useEffect handles the socket connection
	// IMPORTANT: THIS USEEFFECT MUST BE THE FIRST ONE
	useEffect(() => {
		socketRef.current = io(
			process.env.NEXT_PUBLIC_DNS_SERVER_CONNECTION_URL
				? process.env.NEXT_PUBLIC_DNS_SERVER_CONNECTION_URL
				: "https://chat-server-uxdw.onrender.com",
		);

		socketRef.current.on("clientsTotal", (total: number) => {
			setClientsTotal(total);
		});

		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	// This useEffect handles the user's name.
	useEffect(() => {
		const nameGet = localStorage.getItem("name");

		if (!nameGet || nameGet === "Bot") {
			if (nameGet === "Bot") {
				localStorage.removeItem("name");
				alert("You can't use the name 'Bot'");
			}
			router.push("/");
		} else {
			setName(nameGet);
			join(nameGet);
		}
	}, [join, router]);

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

		const handleNewMessage = (message: Message) => {
			setMessages((prev) => [...prev, message]);
		};

		if (socketRef.current) {
			socketRef.current.on("typing", handleTyping);

			socketRef.current.emit("findAllMessages", {}, (response: Message[]) => {
				setMessages(response);
			});

			socketRef.current.on("newMessage", handleNewMessage);
		}

		// Limpeza ao desmontar
		return () => {
			if (socketRef.current) {
				socketRef.current.off("newMessage", handleNewMessage);
				socketRef.current.off("typing", handleTyping);
			}
		};
	}, [name]);

	// This useEffect handles the scroll to the bottom of the chat
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<div className="flex items-center flex-col sm:flex-row justify-evenly py-2 bg-blue-500 text-white">
				<div className="flex items-center justify-center gap-1">
					<FaCircle color={clientsTotal > 0 ? "green" : "gray"} size={22} />
					<span className="text-white">{clientsTotal}</span> users online
				</div>
				<h1 className="text-lg font-bold text-white mt-2 sm:mt-0">Chat</h1>
				<p className="text-white p-2">Chat will be cleaned every 15 minutes.</p>
			</div>
			<div className="flex-1 flex flex-col overflow-y-auto p-2 space-y-2">
				{messages.map((msg, index) => {
					return (
						<div
							key={index}
							className={`${
								msg.name === (localStorage.getItem("name") as string)
									? "self-end bg-green-500 text-white rounded-l-lg rounded-tr-lg"
									: "self-start bg-white text-black rounded-r-lg rounded-tl-lg"
							} p-2 max-w-xs min-w-24 font-medium`}
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
					/>

					<button
						onClick={sendMessage}
						className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg active:bg-green-700 transition duration-150 ease-in-out"
					>
						<IoSendSharp color="white" size={32} />
					</button>
				</div>
			</form>
		</div>
	);
}
