import Web3 from "web3";
import erc from "../constants/erc20.json";
import abi from "../constants/staking.json";
import { cacheTime, nowTime } from "./TextHelper";
import axios from "axios";
import API from "./APIHelper";

const rpc = "https://bsc-dataseed1.ninicoin.io";
const contract = "0xf5a7224602F32ceC97Bc75895C6D58DE9C469b59";
const token = "0x9521728bF66a867BC65A93Ece4a543D817871Eb7";

const getTokenPrice = async () => {
	try {
		const cachedPrice = localStorage.getItem("tokenPrice");
		const priceParam = JSON.parse(cachedPrice);
		if (!cachedPrice || priceParam.expiry < nowTime()) {
			const fetchPrice = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=creo-engine&vs_currencies=usd");
			const amount = fetchPrice.data["creo-engine"].usd;
			const price = {
				amount: amount,
				expiry: cacheTime(),
			};
			localStorage.setItem("tokenPrice", JSON.stringify(price));
			return amount;
		} else {
			return priceParam?.amount;
		}
	} catch (e) {
		console.log(e);
		return 0;
	}
};

const getChartData = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		const lockNumber = await instance.methods.lockNumber().call();
		let stakingList = [];
		for (let i = 0; i < lockNumber; i++) {
			const locked = await instance.methods.locked(i).call();
			if (locked.apy_d2 > 0) {
				stakingList.push({
					period: `${locked.lockPeriodInDays} days`,
					amount: Number(locked.creoStaked),
				});
			}
		}
		return stakingList;
	} catch (e) {
		console.log(e);
	}
};

/* const getUnstakedEvents = async (address) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const fromBlock = 37560731;
		const toBlock = "latest";
		const instance = new web3.eth.Contract(abi, contract);
		const events = await instance.getPastEvents("Unstaked", {
			filter: { stakerAddress: address },
			fromBlock: fromBlock,
			toBlock: toBlock,
		});
		return events;
	} catch (e) {
		console.log(e);
		return [];
	}
}; */

const getUnstakedEvents = async (address) => {
	try {
		const eventList = await API.getPastEvents(address);
		const events = [];
		for (let i = 0; i < eventList.result.length; i++) {
			events.push(eventList.result[i]);
		}
		return events;
	} catch (e) {
		console.log(e);
	}
};

const getTransaction = async (txId) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		return await web3.eth.getTransactionReceipt(txId);
	} catch (e) {
		console.log(e);
	}
};

const getNetwork = async () => {
	try {
		const web3 = new Web3(window.ethereum);
		return web3.eth.getChainId();
	} catch (e) {
		console.log(e);
	}
};

const getBalance = async (user) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(erc, token);
		return await instance.methods.balanceOf(user).call();
	} catch (e) {
		console.log(e);
	}
};

const getAllowance = async (user) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(erc, token);
		return await instance.methods.allowance(user, contract).call();
	} catch (e) {
		console.log(e);
	}
};

const getTotalValueLocked = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(erc, token);
		const balance = Number(await instance.methods.balanceOf(contract).call());
		return balance;
	} catch (e) {
		console.log(e);
	}
};

const getTotalStaked = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.totalCreoStaked().call();
	} catch (e) {
		console.log(e);
	}
};

const getTotalPendingReward = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.totalPendingReward().call();
	} catch (e) {
		console.log(e);
	}
};

const getTotalPoolReward = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(erc, token);
		const totalStake = await getTotalStaked();
		const totalBalance = await instance.methods.balanceOf(contract).call();
		return totalBalance - totalStake;
	} catch (e) {
		console.log(e);
	}
};

const getLockNumber = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.lockNumber().call();
	} catch (e) {
		console.log(e);
	}
};

const getLocked = async (index) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.locked(index).call();
	} catch (e) {
		console.log(e);
	}
};

const getCalculateReward = async (amount, locked) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.calculateReward(amount, locked).call();
	} catch (e) {
		console.log(e);
	}
};

const getMinCREOV = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.minGetCreoV().call();
	} catch (e) {
		console.log(e);
	}
};

const getMinStaking = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.minStaking().call();
	} catch (e) {
		console.log(e);
	}
};

const getMaxStaking = async () => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.maxStaking().call();
	} catch (e) {
		console.log(e);
	}
};

const getStakerDetail = async (addr) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.stakerDetail(addr).call();
	} catch (e) {
		console.log(e);
	}
};

const getStakedLength = async (addr) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.userStakedLength(addr).call();
	} catch (e) {
		console.log(e);
	}
};

const getStakedDetail = async (addr, index) => {
	try {
		const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
		const instance = new web3.eth.Contract(abi, contract);
		return await instance.methods.getStakedDetail(addr, index).call();
	} catch (e) {
		console.log(e);
	}
};

const setChain = (network) => {
	const address = sessionStorage.getItem("account");
	if (address) {
		switch (network) {
			case 137:
				setChainPolygon();
				break;
			case 80001:
				setChainPolygon();
				break;
			default:
				setChainPolygon();
		}
	} else {
		alert("Please connect your wallet!");
	}
};

const setChainPolygon = () => {
	const address = sessionStorage.getItem("account");
	if (address) {
		window.ethereum.request({
			method: "wallet_addEthereumChain",
			params: [
				{
					chainId: "0x89",
					chainName: "Matic Mainnet",
					nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
					rpcUrls: ["https://polygon-rpc.com"],
					blockExplorerUrls: ["https://polygonscan.com/"],
				},
			],
		});
	} else {
		alert("Please connect your wallet!");
	}
};

const setApprove = async (user, amount) => {
	try {
		const walletProvider = sessionStorage.getItem("wallet");
		if (!["TrustWallet", "WalletConnect"].includes(walletProvider)) await window.ethereum.enable();
		const web3 = new Web3(window.ethereum);
		const instance = new web3.eth.Contract(erc, token);
		const gasPrice = await web3.eth.getGasPrice();
		return await instance.methods.approve(contract, String(amount)).send({
			from: user,
			gasPrice: gasPrice,
		});
	} catch (e) {
		console.log(e);
		e.status = "error";
		return e;
	}
};

const setStake = async (user, amount, locked, compound) => {
	try {
		const walletProvider = sessionStorage.getItem("wallet");
		if (!["TrustWallet", "WalletConnect"].includes(walletProvider)) await window.ethereum.enable();
		const web3 = new Web3(window.ethereum);
		const instance = new web3.eth.Contract(abi, contract);
		const gasPrice = await web3.eth.getGasPrice();
		return await instance.methods.stake(amount, locked, compound).send({
			from: user,
			gasPrice: gasPrice,
		});
	} catch (e) {
		console.log(e);
	}
};

const setWithdraw = async (user, amount, index) => {
	try {
		const walletProvider = sessionStorage.getItem("wallet");
		if (!["TrustWallet", "WalletConnect"].includes(walletProvider)) await window.ethereum.enable();
		const web3 = new Web3(window.ethereum);
		const instance = new web3.eth.Contract(abi, contract);
		const gasPrice = await web3.eth.getGasPrice();
		return await instance.methods.unstake(index, amount, user).send({
			from: user,
			gasPrice: gasPrice,
		});
	} catch (e) {
		console.log(e);
	}
};

const staking = {
	getTokenPrice,
	getChartData,
	getUnstakedEvents,
	getTransaction,
	getNetwork,
	getBalance,
	getAllowance,
	getTotalValueLocked,
	getTotalStaked,
	getTotalPendingReward,
	getTotalPoolReward,
	getLockNumber,
	getLocked,
	getCalculateReward,
	getMinCREOV,
	getMinStaking,
	getMaxStaking,
	getStakerDetail,
	getStakedLength,
	getStakedDetail,
	setChain,
	setChainPolygon,
	setApprove,
	setStake,
	setWithdraw,
};

export default staking;
