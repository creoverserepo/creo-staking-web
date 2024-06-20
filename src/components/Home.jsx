import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Chart, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  epochFormat,
  lblFormat,
  maturityDate,
  nowTime,
  numFormat,
} from "../helpers/TextHelper";
import staking from "../helpers/StakingHelper";
import Loading from "./Loading";
import gradientLeft from "../assets/gradient-left.png";
import gradientRight from "../assets/gradient-right.png";
import iconInfo from "../assets/info.svg";
import chBinance from "../assets/network/i-binance.svg";
import chEthereum from "../assets/network/i-ethereum.svg";
import chArbitrum from "../assets/network/i-arbitrum.svg";
/* import exPancakeswap from "../assets/exchange/i-pancakeswap.svg";
import exCoinstore from "../assets/exchange/i-coinstore.svg";
import exMexc from "../assets/exchange/i-mexc.svg";
import exTokocrypto from "../assets/exchange/i-tokocrypto.svg";
import exBitmart from "../assets/exchange/i-bitmart.svg";
import exKanga from "../assets/exchange/i-kanga.svg"; */
import exPancakeswap from "../assets/exchange/ex-pancakeswap.svg";
import exCoinstore from "../assets/exchange/ex-coinstore.svg";
import exMexc from "../assets/exchange/ex-mexc.svg";
import exTokocrypto from "../assets/exchange/ex-tokocrypto.svg";
import exBitmart from "../assets/exchange/ex-bitmart.svg";
import exKanga from "../assets/exchange/ex-kanga.svg";
import exBitget from "../assets/exchange/ex-bitget.svg";
import exUniswap from "../assets/exchange/ex-uniswap.svg";

Chart.register(ArcElement);

const StakeView = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [minCREOV, setMinCREOV] = useState(0);
  const [minStake, setMinStake] = useState(0);
  const [stakeOptions, setStakeOptions] = useState([]);
  const [stakePeriod, setStakePeriod] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakeReward, setStakeReward] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [userStaking, setUserStaking] = useState({});
  const stakeMax = () => {
    if (userBalance <= 0) return false;
    setStakeAmount(userBalance / Math.pow(10, 18));
  };
  const approveSpender = async () => {
    if (address) {
      setTxLoading(true);
      const tx = await staking.setApprove(address, userBalance);
      loadingTransaction(tx);
    } else {
      alert("Please connect your wallet!");
    }
  };
  const submitStake = async () => {
    if (address) {
      setTxLoading(true);
      const tx = await staking.setStake(
        address,
        Number(stakeAmount) * Math.pow(10, 18),
        stakePeriod,
        0
      );
      loadingTransaction(tx);
    } else {
      alert("Please connect your wallet!");
    }
  };
  const loadingTransaction = (tx) => {
    try {
      const { status, transactionHash } = tx;
      if (status === "error") setTxLoading(false);
      if (transactionHash) {
        setTxHash(transactionHash);
        setInterval(() => window.location.reload(), 2500);
      }
    } catch (_) {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const minTokenV = String(await staking.getMinCREOV());
      const minTokenStake = String(await staking.getMinStaking());
      setMinCREOV(minTokenV);
      setMinStake(minTokenStake);
      // setStakeAmount(minTokenStake / Math.pow(10, 18));
      // locked period
      const lockNumber = await staking.getLockNumber();
      setStakeOptions([]);
      for (let i = 0; i < lockNumber; i++) {
        const lock = await staking.getLocked(i);
        setStakeOptions((oldArray) => [...oldArray, lock]);
      }
    })();
  }, []);

  useEffect(() => {
    if (isConnected) {
      (async () => {
        const tokenBalance = String(await staking.getBalance(address));
        const tokenAllowance = String(await staking.getAllowance(address));
        const stakerDetail = await staking.getStakerDetail(address);
        setUserBalance(tokenBalance);
        setUserAllowance(tokenAllowance);
        setUserStaking(stakerDetail);
      })();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (stakeOptions) {
      const amt = stakeAmount * Math.pow(10, 18);
      staking.getCalculateReward(amt, stakePeriod).then((value) => {
        setStakeReward(String(value));
      });
    }
  }, [stakeOptions, stakePeriod, stakeAmount]);

  return (
    <div className="body-box">
      <div className="chain-box grid grid-cols-3 gap-4">
        <button className="btn-chain active">
          <div className="flex items-center justify-center">
            <img src={chBinance} style={{ width: "24px" }}></img>
            <div className="ml-2">Binance</div>
          </div>
        </button>
        <button className="btn-chain" disabled={true}>
          <div className="flex items-center justify-center">
            <img src={chEthereum}></img>
            <div className="ml-2">Ethereum</div>
          </div>
        </button>
        <button className="btn-chain" disabled={true}>
          <div className="flex items-center justify-center">
            <img src={chArbitrum}></img>
            <div className="ml-2">Arbitrum</div>
          </div>
        </button>
      </div>
      <div className="apr-box flex gap-4">
        {stakeOptions.map((val, key) => {
          return (
            val?.apy_d2 > 0 && (
              <button
                className={"btn-apr " + (key === stakePeriod ? "active" : "")}
                key={key}
                onClick={() => setStakePeriod(key)}
              >
                <div>{val.lockPeriodInDays + " Days"}</div>
                <div className="apr-info">
                  <div className="value">{Number(val?.apy_d2) / 100 + "%"}</div>
                  <div className="label">apr</div>
                </div>
              </button>
            )
          );
        })}
      </div>
      {/* <p className="apr-desc">
				You need to stake {minCREOV ? lblFormat(minCREOV, 18, " $CREO") : "..."} to get CREOV token. Minimum stake amount is {minStake ? lblFormat(minStake, 18, " $CREO") : ".."}.
			</p> */}
      <div className="info-box">
        <div className="info flex items-center justify-between">
          <div>Staked Amount</div>
          <div>
            {lblFormat(String(userStaking?.stakedAmount || 0), 18, " $CREO")}
          </div>
        </div>
        <div className="info flex items-center justify-between">
          <div>Wallet Balance</div>
          <div>
            {userBalance ? lblFormat(userBalance, 18, " $CREO") : "..."}
          </div>
        </div>
        <div className="info flex items-center justify-between">
          <div className="flex items-center">
            <div>Allowance</div>
            <div className="edit" onClick={approveSpender}>
              (Edit)
            </div>
            <img src={iconInfo} />
          </div>
          <div>
            {userAllowance ? lblFormat(userAllowance, 18, " $CREO") : "..."}
          </div>
        </div>
      </div>
      {txLoading && (
        <div className="my-2">
          <Loading chain={80001} txId={txHash} />
        </div>
      )}
      {!txLoading && (
        <>
          <div className="stake-box">
            <label className="label">Enter Stake Amount</label>
            <div className="relative">
              <input
                className="input"
                placeholder="$CREO Amount"
                value={stakeAmount <= 0 ? "" : stakeAmount}
                onChange={(e) =>
                  setStakeAmount(isNaN(e.target.value) ? 0 : e.target.value)
                }
              />
              <button className="button" onClick={stakeMax}>
                Max
              </button>
            </div>
          </div>
          <div className="stat-box grid grid-cols-3">
            <div className="stat">
              <div className="label">APR Rate</div>
              <div className="value">
                {stakeOptions[stakePeriod]?.apy_d2
                  ? Number(stakeOptions[stakePeriod]?.apy_d2) / 100 + "%"
                  : "..."}
              </div>
            </div>
            <div className="stat">
              <div className="label">Maturity Date</div>
              <div className="value">
                {stakeOptions[stakePeriod]?.lockPeriodInDays
                  ? maturityDate(
                      Number(stakeOptions[stakePeriod]?.lockPeriodInDays)
                    )
                  : "..."}
              </div>
            </div>
            <div className="stat">
              <div className="label">Reward Balance</div>
              <div className="value">
                {stakeReward ? lblFormat(stakeReward, 18, " $CREO") : "..."}
              </div>
            </div>
          </div>
          {!address && (
            <button className="connect-wallet" onClick={open}>
              Connect Your Wallet
            </button>
          )}
          {address &&
            userAllowance < stakeAmount * Math.pow(10, 18) &&
            stakeAmount * Math.pow(10, 18) >= minStake && (
              <p className="my-4 text-lg text-center font-bold">
                Increase the allowance amount or to adjust the input to match
                the allowance amount
              </p>
            )}
          {address && stakeAmount * Math.pow(10, 18) < minStake && (
            <p className="my-4 text-lg text-center font-bold">
              Minimum stake amount is{" "}
              {minStake ? lblFormat(minStake, 18, " $CREO") : ".."}
            </p>
          )}
          {address && (
            <button
              className="stake-token"
              onClick={submitStake}
              disabled={
                !(
                  address &&
                  userAllowance >= stakeAmount * Math.pow(10, 18) &&
                  stakeAmount * Math.pow(10, 18) >= minStake
                )
              }
            >
              Stake
            </button>
          )}
        </>
      )}
    </div>
  );
};

const OngoingStaking = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [userStaking, setUserStaking] = useState({});
  const [userStakedDetails, setUserStakedDetails] = useState("");
  const submitWithdraw = async (index, amount) => {
    if (address) {
      setTxLoading(true);
      const tx = await staking.setWithdraw(address, String(amount), index);
      loadingTransaction(tx);
    } else {
      alert("Please connect your wallet!");
    }
  };
  const loadingTransaction = (tx) => {
    try {
      const { status, transactionHash } = tx;
      if (status === "error") setTxLoading(false);
      if (transactionHash) {
        setTxHash(transactionHash);
        setInterval(() => window.location.reload(), 2500);
      }
    } catch (_) {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const price = await staking.getTokenPrice();
      setTokenPrice(price);
    })();
  }, []);

  useEffect(() => {
    if (isConnected) {
      (async () => {
        const stakerDetail = await staking.getStakerDetail(address);
        setUserStaking(stakerDetail);
        setUserStakedDetails([]);
        const stakedLength = await staking.getStakedLength(address);
        for (let i = 0; i < stakedLength; i++) {
          const lock = await staking.getStakedDetail(address, i);
          lock.index = i;
          setUserStakedDetails((oldArray) => [...oldArray, lock]);
        }
      })();
    }
  }, [isConnected, address]);

  return (
    <div className="history-box">
      <div className="flex items-start justify-between gap-x-4">
        <h2 className="title">My Ongoing Staking Details</h2>
        <div className="amount-box">
          <div className="label">Total Staking Amount</div>
          <div className="value-token">
            {userStaking?.stakedAmount
              ? lblFormat(String(userStaking?.stakedAmount), 18, " CREO")
              : "..."}
          </div>
          <div className="value-usd">
            {tokenPrice && userStaking?.stakedAmount
              ? "~$" +
                lblFormat(
                  Number(userStaking?.stakedAmount) * tokenPrice * 1,
                  18,
                  ""
                )
              : "..."}
          </div>
        </div>
      </div>
      {!address && (
        <div className="mt-6">
          <button className="connect-wallet" onClick={open}>
            Connect Your Wallet
          </button>
        </div>
      )}
      {txLoading && (
        <div className="my-2">
          <Loading chain={80001} txId={txHash} />
        </div>
      )}
      {address && !txLoading && !userStakedDetails && (
        <div className="mt-4 text-xl text-center font-bold">
          Loading data...
        </div>
      )}
      {address &&
        !txLoading &&
        userStakedDetails &&
        userStakedDetails.length === 0 && (
          <div className="my-12 text-xl text-center">
            There is no ongoing staking data
          </div>
        )}
      {address &&
        !txLoading &&
        userStakedDetails &&
        userStakedDetails.map((val, key) => {
          return (
            <div className="item" key={key}>
              <div className="grid grid-cols-2">
                <div className="info-left-box">
                  <div className="name">{val.lockPeriodInDays + " days"}</div>
                  <div className="detail-box">
                    <div className="label">Staking Time:</div>
                    <div className="value">
                      {epochFormat(String(val.stakedAt))}
                    </div>
                  </div>
                  <div className="detail-box">
                    <div className="label">Maturity Time:</div>
                    <div className="value">
                      {epochFormat(String(val.endedAt))}
                    </div>
                  </div>
                </div>
                <div className="info-right-box">
                  <div className="name">
                    {lblFormat(String(val.amount), 18, " CREO")}
                  </div>
                  <div className="detail-box">
                    <div className="label">Rewards:</div>
                    <div className="value">
                      {lblFormat(String(val.reward), 18, " CREO")}
                    </div>
                  </div>
                  <div className="detail-box">
                    <div className="label">Prematurity Penalty:</div>
                    <div className="value">
                      {lblFormat(String(val.prematurePenalty), 18, " CREO")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-x-2">
                <button
                  className="btn-withdraw"
                  onClick={() => submitWithdraw(key, val.amount)}
                  disabled={nowTime() >= Number(val.endedAt)}
                >
                  Premature Withdraw
                </button>
                <button
                  className="btn-claim"
                  onClick={() => submitWithdraw(key, 0)}
                  disabled={nowTime() < Number(val.endedAt)}
                >
                  Claim Staking
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const PastStaking = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [userUnstakedDetails, setUserUnstakedDetails] = useState("");

  useEffect(() => {
    if (isConnected) {
      (async () => {
        const pastStake = await staking.getUnstakedEvents(address);
        setUserUnstakedDetails(pastStake);
      })();
    }
  }, [isConnected, address]);

  return (
    <div className="history-box">
      <h2 className="title">My Past Staking Details</h2>
      <p className="desc">
        *to view the transaction on blockchain explorer, you can click the Tx
        Hash.
      </p>
      {!address && (
        <div className="mt-6">
          <button className="connect-wallet" onClick={open}>
            Connect Your Wallet
          </button>
        </div>
      )}
      {address && !userUnstakedDetails && (
        <div className="mt-4 text-xl text-center font-bold">
          Loading data...
        </div>
      )}
      {address && userUnstakedDetails && userUnstakedDetails.length === 0 && (
        <div className="my-12 text-xl text-center">
          There is no past staking data
        </div>
      )}
      {userUnstakedDetails &&
        userUnstakedDetails.map((val, key) => {
          return (
            <div className="item" key={key}>
              <div className="grid grid-cols-2">
                <div className="info-left-box">
                  <div className="name">
                    {val?.ev_data?.lockPeriodInDays + " days"}
                  </div>
                  <div className="detail-box">
                    <div className="label">Staking Time:</div>
                    <div className="value">
                      {epochFormat(String(val?.ev_data?.stakedAt))}
                    </div>
                  </div>
                  <div className="detail-box">
                    <div className="label">Maturity Time:</div>
                    <div className="value">
                      {epochFormat(String(val?.ev_data?.endedAt))}
                    </div>
                  </div>
                </div>
                <div className="info-right-box">
                  <div className="name">
                    {lblFormat(String(val?.ev_data?.amount), 18, " CREO")}
                  </div>
                  <div className="detail-box">
                    <div className="label">Rewards:</div>
                    <div className="value">
                      {lblFormat(String(val?.ev_data?.reward), 18, " CREO")}
                    </div>
                  </div>
                  <div className="detail-box">
                    <div className="label">Unstaked Time:</div>
                    <div className="value">
                      {epochFormat(String(val?.ev_data?.unstakedAt))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="tx-hash-box">
                <div className="label">Tx Hash:</div>
                <a
                  href={`https://bscscan.com/tx/${val.tx_hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="value"
                >
                  {val.tx_hash}
                </a>
              </div>
            </div>
          );
        })}
    </div>
  );
};

function Home() {
  const chartBackground = ["#26C0F8", "#5398FF"];
  const [openExchange, setOpenExchange] = useState(false);
  const [chartLabel, setChartLabel] = useState("");
  const [chartData, setChartData] = useState("");
  const [menu, setMenu] = useState("new");
  const [submenu, setSubmenu] = useState("ongoing");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [totalValueLocked, setTotalValueLocked] = useState("");
  const [totalStaked, setTotalStaked] = useState("");
  const [totalReward, setTotalReward] = useState("");
  const [totalPending, setTotalPending] = useState("");
  const chooseMenu = (value) => {
    const listMenu = ["new", "history"];
    if (listMenu.includes(value)) {
      localStorage.setItem("stakingMenu", value);
      setMenu(value);
    } else {
      alert("Error, menu not found!");
    }
  };
  const chooseSubmenu = (value) => {
    const listSubmenu = ["ongoing", "ended"];
    if (listSubmenu.includes(value)) {
      localStorage.setItem("stakingSubmenu", value);
      setSubmenu(value);
    } else {
      alert("Error, submenu not found!");
    }
  };

  useEffect(() => {
    const listMenu = ["new", "history"];
    const listSubmenu = ["ongoing", "ended"];
    const currentMenu = localStorage.getItem("stakingMenu");
    const currentSubmenu = localStorage.getItem("stakingSubmenu");
    if (currentMenu && listMenu.includes(currentMenu)) setMenu(currentMenu);
    if (currentSubmenu && listSubmenu.includes(currentSubmenu))
      setSubmenu(currentSubmenu);
    // get smart contract data
    (async () => {
      const totalTokenValueLocked = String(await staking.getTotalValueLocked());
      const totalTokenStaked = String(await staking.getTotalStaked());
      const totalTokenReward = String(await staking.getTotalPoolReward());
      const totalTokenPending = String(await staking.getTotalPendingReward());
      const chartData = await staking.getChartData();
      const price = await staking.getTokenPrice();
      setTokenPrice(price);
      setChartLabel(chartData.map((item) => item.period));
      setChartData(chartData.map((item) => item.amount));
      setTotalValueLocked(totalTokenValueLocked);
      setTotalStaked(totalTokenStaked);
      setTotalReward(totalTokenReward);
      setTotalPending(totalTokenPending);
    })();
  }, []);

  return (
    <main>
      <div className={"overlay " + (openExchange ? "active" : "")}>
        <div className="exchange-container">
          <div className="flex items-center justify-between">
            <div className="exchange-title">Buy $CREO on:</div>
            <button
              className="exchange-close"
              onClick={() => setOpenExchange(false)}
            >
              &times;
            </button>
          </div>
          <div className="exchange-list">
            <div className="item">
              <a
                href="https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x9521728bF66a867BC65A93Ece4a543D817871Eb7"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exPancakeswap} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://www.mexc.com/exchange/CREO_USDT"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exMexc} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://www.bitmart.com/trade/en-US?symbol=CREO_USDT"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exBitmart} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://www.coinstore.com/#/spot/CREOUSDT"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exCoinstore} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://www.tokocrypto.com/en/trade/CREO_USDT"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exTokocrypto} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://trade.kanga.exchange/market/CREO-USDT"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exKanga} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://www.bitget.com/id/spot/CREOUSDT"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exBitget} className="" />
              </a>
            </div>
            <div className="item">
              <a
                href="https://app.uniswap.org/swap?chain=bnb&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x9521728bF66a867BC65A93Ece4a543D817871Eb7"
                target="_blank"
                rel="noreferrer"
              >
                <img src={exUniswap} className="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <img src={gradientLeft} className="home-left-img" />
      <img src={gradientRight} className="home-right-img" />
      <div className="home-container">
        <div className="custom-container mx-auto">
          <div className="w-full lg:flex lg:justify-between lg:items-center lg:gap-8">
            <div className="home-intro-box">
              <h1 className="home-intro-title">
                <span className="pr-2">
                  Stake <span className="txt-primary">$CREO</span> &
                  <br />
                  Earn up to 18% APY
                  <br />
                </span>
                {/* <span className="txt-primary">$CREO</span> */}
              </h1>
              <div className="py-8 px-4 lg:px-0">
                <button
                  className="btn-primary"
                  onClick={() => setOpenExchange(true)}
                >
                  Buy $CREO
                </button>
              </div>
              {/* <div className="py-8 px-4 lg:px-0">
								<a href="https://www.tokocrypto.com/en/trade/CREO_USDT" className="btn-primary" target="_blank" rel="noreferrer">
									Buy $CREO
								</a>
							</div> */}
              {/* <div className="home-exchange-box">
								<p className="mb-4 uppercase">Available On:</p>
								<div className="flex gap-4 mb-4">
									<a
										href="https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x9521728bF66a867BC65A93Ece4a543D817871Eb7"
										target="_blank"
										rel="noreferrer"
									>
										<img src={exPancakeswap} className="" />
									</a>
									<a href="https://www.coinstore.com/#/spot/CREOUSDT" target="_blank" rel="noreferrer">
										<img src={exCoinstore} className="" />
									</a>
									<a href="https://www.mexc.com/exchange/CREO_USDT" target="_blank" rel="noreferrer">
										<img src={exMexc} className="" />
									</a>
								</div>
								<div className="flex gap-4 mb-4">
									<a href="https://www.tokocrypto.com/en/trade/CREO_USDT" target="_blank" rel="noreferrer">
										<img src={exTokocrypto} className="" />
									</a>
									<a href="https://www.bitmart.com/trade/en-US?symbol=CREO_USDT" target="_blank" rel="noreferrer">
										<img src={exBitmart} className="" />
									</a>
									<a href="https://trade.kanga.exchange/market/CREO-USDT" target="_blank" rel="noreferrer">
										<img src={exKanga} className="" />
									</a>
								</div>
							</div> */}
              {/* <div className="mt-8 home-intro-text ">
                Legacy $CREO staking and farming pools are closed. The new pools
                are open with Seed Staking Boosters. You can deposit now.
              </div> */}
            </div>
            <div className="home-staking-box">
              <div className="head-box">
                <div className="flex justify-between items-center">
                  {menu === "new" && <div className="title active">Stake</div>}
                  {menu === "history" && (
                    <div className="flex gap-x-4">
                      <div
                        className={
                          "cursor-pointer title " +
                          (submenu === "ongoing" ? "active" : "")
                        }
                        onClick={() => chooseSubmenu("ongoing")}
                      >
                        Ongoing
                      </div>
                      <div
                        className={
                          "cursor-pointer title " +
                          (submenu === "ended" ? "active" : "")
                        }
                        onClick={() => chooseSubmenu("ended")}
                      >
                        Ended
                      </div>
                    </div>
                  )}
                  <select
                    className="option"
                    onChange={(e) => chooseMenu(e.target.value)}
                    value={menu}
                  >
                    <option value="new">New</option>
                    <option value="history">History</option>
                  </select>
                </div>
              </div>
              {menu === "new" && <StakeView />}
              {menu === "history" && (
                <div className="body-box">
                  {submenu === "ongoing" && <OngoingStaking />}
                  {submenu === "ended" && <PastStaking />}
                </div>
              )}
            </div>
          </div>
          <div className="mt-12 statistic-container">
            <div className="grid grid-cols-1 gap-4 gap-y-10 md:grid-cols-2 md:gap-8">
              <div className="left-box">
                <div className="title">Statistic</div>
                <div className="info-box">
                  <div className="info flex justify-between items-center">
                    <div className="label">Total Value Locked</div>
                    <div className="value">
                      {totalValueLocked && tokenPrice
                        ? "$" +
                          numFormat(
                            totalValueLocked * tokenPrice * 1,
                            18
                          ).toFixed(2)
                        : "..."}
                    </div>
                  </div>
                  <div className="info flex justify-between items-center">
                    <div className="label">Total Staked</div>
                    <div className="value">
                      {totalStaked
                        ? lblFormat(totalStaked, 18, " CREO")
                        : "..."}
                    </div>
                  </div>
                  <div className="info flex justify-between items-center">
                    <div className="label">Total Supply</div>
                    <div className="value">1B CREO</div>
                  </div>
                  <div className="info flex justify-between items-center">
                    <div className="label">Max Supply</div>
                    <div className="value">1B CREO</div>
                  </div>
                  <div className="info flex justify-between items-center">
                    <div className="label">Circulating Supply</div>
                    <div className="value">290M CREO</div>
                  </div>
                  <div className="info flex justify-between items-center">
                    <div className="label">
                      Percentage CREO staked by circulating supply
                    </div>
                    <div className="value">29%</div>
                  </div>
                </div>
              </div>
              <div className="right-box">
                <div className="title flex">
                  <img src={chBinance} style={{ width: "2.5rem" }}></img>
                  <div className="ml-3">BNB Smart Chain</div>
                </div>
                <div className="stat-container grid grid-cols-3 my-6">
                  <div className="stat-left-box text-center">
                    <div className="token">
                      {totalStaked
                        ? lblFormat(totalStaked, 18, " CREO")
                        : "..."}
                    </div>
                    <div className="value">
                      {totalStaked && tokenPrice
                        ? "~$" + lblFormat(totalStaked * tokenPrice, 18, "")
                        : "..."}
                    </div>
                    <div className="label">Total $CREO Staked</div>
                  </div>
                  <div className="stat-middle-box text-center">
                    <div className="token">
                      {totalReward
                        ? lblFormat(totalReward, 18, " CREO")
                        : "..."}
                    </div>
                    <div className="value">
                      {totalReward && tokenPrice
                        ? "~$" + lblFormat(totalReward * tokenPrice, 18, "")
                        : "..."}
                    </div>
                    <div className="label">Total Pool Rewards</div>
                  </div>
                  <div className="stat-right-box text-center">
                    <div className="token">
                      {totalPending
                        ? lblFormat(totalPending, 18, " CREO")
                        : "..."}
                    </div>
                    <div className="value">
                      {totalPending && tokenPrice
                        ? "~$" + lblFormat(totalPending * tokenPrice, 18, "")
                        : "..."}
                    </div>
                    <div className="label">Total Pending Rewards</div>
                  </div>
                </div>
                {chartData.length > 0 && (
                  <div className="mt-4 flex justify-center items-center">
                    {chartLabel && chartData ? (
                      <>
                        <div className="staking-chart-image">
                          <Pie
                            data={{
                              labels: chartLabel,
                              datasets: [
                                {
                                  data: chartData,
                                  backgroundColor: chartBackground,
                                  borderWidth: 1,
                                },
                              ],
                            }}
                          />
                        </div>
                        <div className="staking-chart-info ml-4">
                          <div className="staking-chart-title">
                            Staking Duration Chart
                          </div>
                          {chartLabel.map((_, key) => {
                            return (
                              <div
                                key={key}
                                className="staking-chart-label"
                                style={{ color: chartBackground[key] }}
                              >
                                {"- " +
                                  chartLabel[key] +
                                  " = " +
                                  lblFormat(chartData[key], 18, " CREO")}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div>Loading data ...</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
