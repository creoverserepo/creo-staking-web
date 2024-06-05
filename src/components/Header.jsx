import { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { addressShort } from "../helpers/TextHelper";
import iconNavigation from "../assets/navigation.svg";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";

function Header() {
	const { open } = useWeb3Modal();
	const { address, isConnected, isDisconnected } = useAccount();
	const [openNavbar, setOpenNavbar] = useState(false);
	const [walletAddress, setWalletAddress] = useState("");

	useEffect(() => {
		if (isConnected) {
			setWalletAddress(address);
			setOpenNavbar(false);
		}
	}, [isConnected, address]);

	useEffect(() => {
		if (isDisconnected) {
			setWalletAddress("");
			setOpenNavbar(false);
		}
	}, [isDisconnected]);

	return (
		<header>
			<div className="flex flex-wrap items-center justify-between">
				<a href="/">
					<img src={logo} className="header-logo mr-16" alt="Creo Engine Logo" />
				</a>
				<img src={iconNavigation} className="header-nav" onClick={() => setOpenNavbar(!openNavbar)} />
				<nav className="w-full flex-grow hidden lg:flex lg:items-center lg:w-auto">
					<a href="https://www.creoengine.com/" className="header-link" target="_blank" rel="noreferrer">
						Home
					</a>
					<a href="https://creoplay.app/games" className="header-link" target="_blank" rel="noreferrer">
						Games
					</a>
					<a href="#" className="header-link">
						Library
					</a>
					<a href="https://creoplay.app/marketplace" className="header-link" target="_blank" rel="noreferrer">
						Marketplace
					</a>
					<a href="#" className="header-link active">
						Staking
					</a>
					<a href="#" className="header-link">
						Bridge
					</a>
					<a href="https://creoplay.app/comingsoon" className="header-link" target="_blank" rel="noreferrer">
						Launchpad
					</a>
					<div className="ml-auto">
						{!walletAddress ? (
							<button className="header-connect-wallet" onClick={() => open()}>
								Connect Wallet
							</button>
						) : (
							<button className="header-connected-wallet flex items-center" onClick={() => open()}>
								<img src={avatar} className="wallet-img" />
								<div className="ml-4">
									<div>
										<span className="address">{addressShort(walletAddress)}</span>
										<span className="triangle">▼</span>
									</div>
									<div className="status">Connected</div>
								</div>
							</button>
						)}
					</div>
				</nav>
			</div>
			<div className={"navbar " + (openNavbar ? "visible" : "")} onClick={() => setOpenNavbar(!openNavbar)}>
				<ul className="header-nav-mobile" onClick={(e) => e.stopPropagation()}>
					<li className="mb-4">
						{!walletAddress ? (
							<button className="header-connect-wallet" onClick={() => open()}>
								Connect Wallet
							</button>
						) : (
							<button className="header-connected-wallet flex items-center" onClick={() => open()}>
								<img src={avatar} className="wallet-img" />
								<div className="ml-4">
									<div>
										<span className="address">{addressShort(walletAddress)}</span>
										<span className="triangle">▼</span>
									</div>
									<div className="status">Connected</div>
								</div>
							</button>
						)}
					</li>
					<li>
						<a href="https://www.creoengine.com/" className="header-link" target="_blank" rel="noreferrer">
							Home
						</a>
					</li>
					<li>
						<a href="https://creoplay.app/games" className="header-link" target="_blank" rel="noreferrer">
							Games
						</a>
					</li>
					<li>
						<a href="#" className="header-link">
							Library
						</a>
					</li>
					<li>
						<a href="https://creoplay.app/marketplace" className="header-link" target="_blank" rel="noreferrer">
							Marketplace
						</a>
					</li>
					<li>
						<a href="#" className="header-link active">
							Staking
						</a>
					</li>
					<li>
						<a href="#" className="header-link">
							Bridge
						</a>
					</li>
					<li>
						<a href="https://creoplay.app/comingsoon" className="header-link" target="_blank" rel="noreferrer">
							Launchpad
						</a>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default Header;
