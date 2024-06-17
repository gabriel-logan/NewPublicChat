"use client";

import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { Socket } from "socket.io-client";

export default function DrawerComponent({
	isOpen,
	toggleDrawer,
	socketRef,
}: {
	isOpen: boolean;
	toggleDrawer: () => void;
	socketRef: React.MutableRefObject<Socket | null>;
}) {
	const [roomName, setRoomName] = useState("");
	const [roomKey, setRoomKey] = useState("");

	const [rooms, setRooms] = useState<
		{
			roomName: string;
			rootKey: string;
		}[]
	>([]);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!roomName || !roomKey) {
			alert("Please fill all fields");
			return;
		}

		if (roomName.length > 100) {
			alert("Room name can't be more than 100 characters");
			return;
		}

		if (roomKey.length > 100) {
			alert("Room key can't be more than 100 characters");
			return;
		}

		if (roomKey.length < 10) {
			alert("Room key must be at least 10 characters");
			return;
		}

		if (roomName.length < 3) {
			alert("Room name must be at least 3 characters");
			return;
		}

		const newRoom = {
			roomName,
			rootKey: roomKey,
		};

		setRooms((prevState) => [...prevState, newRoom]);

		setRoomName("");

		setRoomKey("");
	}

	function joinPrivateRoom() {
		const socket: Socket | null = socketRef.current;

		if (socket) {
			socket.emit("joinPrivateRoom");
		}
	}

	useEffect(() => {}, []);

	return (
		<>
			<Drawer
				open={isOpen}
				onClose={toggleDrawer}
				direction="right"
				className="bla bla bla"
				customIdSuffix="drawer"
			>
				<div className="text-black p-4">
					<h1 className="text-4xl font-bold mb-4">Public Chat</h1>
					<button
						type="button"
						onClick={toggleDrawer}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Join Public Chat
					</button>
				</div>
				<div className="text-black p-4">
					<h2 className="text-2xl font-bold mb-4">Add new private chat room</h2>
					<span>Not Implemented Yet</span>
					<form onSubmit={handleSubmit} className="space-y-4">
						<label
							htmlFor="roomName"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
							Room Name
						</label>
						<input
							type="text"
							id="roomName"
							value={roomName}
							onChange={(event) => setRoomName(event.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
						<label
							htmlFor="roomKey"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
							Room Private Key
						</label>
						<input
							type="text"
							id="roomKey"
							value={roomKey}
							onChange={(event) => setRoomKey(event.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Create Room
						</button>
					</form>
				</div>
				<div className="text-black p-4 border h-96 overflow-y-auto">
					<h2 className="text-2xl font-bold mb-4">Private Chat Rooms</h2>
					{rooms.length > 0 ? (
						<ul className="list-disc pl-5 space-y-2">
							{rooms.map((room) => (
								<li key={room.roomName} className="break-all">
									<button
										type="button"
										onClick={joinPrivateRoom}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
									>
										Join {room.roomName} room
									</button>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No private chat rooms available</p>
					)}
				</div>
			</Drawer>
		</>
	);
}
