interface IAppConfig {
	urlDnsAllowed: string;
}

export default (): IAppConfig => ({
	urlDnsAllowed:
		process.env.URL_DNS_ALLOWED || "https://chat-client-rwag.onrender.com/",
});
