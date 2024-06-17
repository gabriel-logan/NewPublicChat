import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-modern-drawer/dist/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Public Chat Room",
	description: "A public chat room, for everyone to join and chat.",
	creator: "Gabriel Logan",
	authors: { name: "Gabriel Logan", url: "https://github.com/gabriel-logan" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ToastContainer autoClose={800} />
				{children}
			</body>
		</html>
	);
}
