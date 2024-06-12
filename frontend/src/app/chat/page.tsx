"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { FaCircle } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import io, { Socket } from "socket.io-client";

import { Message } from "@/types/chat";

import Form from "./Form";
import MessagesSection from "./MessagesSection";

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([]);

	const [name, setName] = useState("");

	const [clientsTotal, setClientsTotal] = useState(0);

	const router = useRouter();

	const socketRef = useRef<Socket | null>(null);

	const join = useCallback((value: string) => {
		(() => {
			const socket: Socket | null = socketRef.current;
			if (socket) {
				socket.emit("join", { name: value });
			}
		})();
	}, []);

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

		socketRef.current.on("userConnected", (response: boolean) => {
			if (response === false) {
				toast("User disconnected");
			} else {
				toast.info("New user connected");
			}
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

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<div className="flex items-center flex-col sm:flex-row justify-evenly py-2 bg-blue-500 text-white">
				<div className="flex items-center justify-center gap-1">
					<FaCircle color={clientsTotal > 0 ? "green" : "gray"} size={22} />
					<span className="text-white">{clientsTotal}</span> users online
				</div>
				<h1 className="text-lg font-bold text-white mt-2 sm:mt-0">Chat</h1>
				<p className="text-white p-2">Chat will be cleaned every 15 minutes.</p>
				<Link
					href="https://github.com/gabriel-logan/NewPublicChat"
					target="_blank"
					className="text-gray-200 hover:text-gray-50 hover:underline"
				>
					Github
				</Link>
			</div>

			{socketRef.current ? (
				<MessagesSection messages={messages} />
			) : (
				<div className="flex-1 flex justify-center items-center">
					<HashLoader color="#36d7b7" size={128} />
				</div>
			)}

			<Form name={name} setMessages={setMessages} socketRef={socketRef} />
		</div>
	);
}
