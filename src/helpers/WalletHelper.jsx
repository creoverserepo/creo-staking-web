import { createWeb3Modal } from "@web3modal/wagmi/react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { bsc } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "ed8f0a98e2f6e3d922195cb3a1f721a4";

// 2. Create wagmiConfig
const metadata = {
	name: "Web3Modal",
	description: "Web3Modal Example",
	url: "https://web3modal.com", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const config = createConfig({
	chains: [bsc],
	transports: {
		[bsc.id]: http(),
	},
	connectors: [
		walletConnect({ projectId, metadata, showQrModal: false }),
		// coinbaseWallet({
		// 	appName: metadata.name,
		// 	appLogoUrl: metadata.icons[0],
		// }),
	],
});

// 3. Create modal
createWeb3Modal({
	wagmiConfig: config,
	projectId,
});

// eslint-disable-next-line react/prop-types
export function WalletProvider({ children }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
