// eslint-disable-next-line react/prop-types
// function Loading({ message, chain, txId }) {
// 	const blockchainExplorer = {
// 		1: "https://etherscan.io/tx/",
// 		56: "https://bscscan.com/tx/",
// 		42161: "https://arbiscan.io/tx/",
// 		80001: "https://mumbai.polygonscan.com/tx/",
// 	};

// 	return (
// 		<>
// 			<div className="text-xs mb-1 italic">{message || "Loading transaction to be completed ..."}</div>
// 			<div className="loadingbar"></div>
// 			{txId && (
// 				<div className="mt-1 text-sm">
// 					<div className="pr-1">Check Tx ID : </div>
// 					<a href={chain ? blockchainExplorer[chain] + txId : blockchainExplorer[56] + txId} target="_blank" rel="noreferrer" className="underline break-words">
// 						{txId}
// 					</a>
// 				</div>
// 			)}
// 		</>
// 	);
// }

// eslint-disable-next-line react/prop-types
function Loading({ message }) {
	return (
		<>
			<div className="text-xs mb-1 italic">{message || "Loading transaction to be completed ..."}</div>
			<div className="loadingbar"></div>
		</>
	);
}

export default Loading;
