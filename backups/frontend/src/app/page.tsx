"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const [name, setName] = useState("");

	const router = useRouter();

	async function joinChat(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!name.trim()) {
			alert("Please enter a username");
			return;
		}

		if (name === "Bot") {
			alert("Bot is a reserved username, please choose another one.");
			return;
		}

		localStorage.setItem("name", name);

		router.push("/chat");
	}

	useEffect(() => {
		const nameGet = localStorage.getItem("name");

		if (nameGet) {
			setName(nameGet);
		}
	}, []);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-3xl font-extrabold text-gray-900">
				Hello World {name}
			</h1>
			<form onSubmit={joinChat} className="w-full max-w-md">
				<input
					placeholder="Username"
					type="text"
					name="name"
					value={name}
					onChange={(event) => setName(event.target.value)}
					id="name"
					className="appearance-none mb-2 rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
				/>
				<button
					type="submit"
					className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Join Chat
				</button>
			</form>
			<div className="flex flex-col justify-center items-center mt-6">
				<h2 className="text-black">Contribute to this project on</h2>
				<Link
					href="https://github.com/gabriel-logan/NewPublicChat"
					target="_blank"
					className="text-blue-500 hover:text-blue-700 hover:underline"
				>
					Github Repository
				</Link>
			</div>
		</main>
	);
}
