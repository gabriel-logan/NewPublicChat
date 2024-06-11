interface IAppConfig {
	port: number;
	urlDnsAllowed: string;
}

export default (): IAppConfig => ({
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
	urlDnsAllowed:
		process.env.URL_DNS_ALLOWED || "https://chat-client-rwag.onrender.com/",
});
