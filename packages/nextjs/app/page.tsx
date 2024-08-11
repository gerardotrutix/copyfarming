"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cacheExchange, fetchExchange } from "@urql/core";
import type { NextPage } from "next";
import { toWei } from "thirdweb";
import { getContract, prepareContractCall } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { useSendTransaction } from "thirdweb/react";
import { createClient, gql } from "urql";
import { thirdWebClient } from "~~/app/client";
//import { useReadContract } from "thirdweb/react";
import { useReadContract } from 'wagmi';
import externalContracts from "~~/contracts/externalContracts";
import { getAccount } from "wagmi/actions";
import { sendTransaction } from "thirdweb"
import { TransactionHash } from "./blockexplorer/_components";


const STATE_VAULTS = 0;
const STATE_INVESTMENTS = 1;

const client = createClient({
  url: "https://gateway-arbitrum.network.thegraph.com/api/a26da39d06ecbf637c8b1ba4fe5659f9/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
  exchanges: [cacheExchange, fetchExchange],
});

const mockVaultsData = {
  availableVaults: [
    {
      vaultId: 1,
      wallet: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyAdded: 50000,
      expectedAPR: 60,
      minimumInvestment: 250,
      strategy: "Yield Farming on Uniswap",
      vaultFee: 50,
    },
    {
      vaultId: 2,
      wallet: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyAdded: 100000,
      expectedAPR: 80,
      minimumInvestment: 250,
      strategy: "Yield Farming on Meteora",
      vaultFee: 50,
    },
  ],
};

const mockInvestmenstData = {
  investments: [
    {
      investmentId: 1,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 250,
      vaultId: 1,
    },
    {
      investmentId: 2,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 250,
      vaultId: 2,
    },
  ],
};

interface Investment {
  liquidity: number;
  fees: number;
  apr: number;
  vaultId: number;
  pnl: number;
  moneyInvested: number;
}

interface WalletVaultInfo {
  vaultId: number;
  wallet: string;
}

async function getCurrentInvestments() {
  //const investmentsFromUniswap = await client.query(DATA_QUERY_OPORTUNITIES, {}).toPromise();

  //getCurrentVaults();

  // Get the wallets that have invested in the vaults
  const totalInvestmentPerVault: WalletVaultInfo[] = [];
  const moneyInvestedByVaultMap = new Map<number, number>();

  const vaultIdToWalletMap = new Map<number, string>();

  // Populate the map with data from mockVaultsData
  mockVaultsData.availableVaults.forEach(vault => {
    vaultIdToWalletMap.set(vault.vaultId, vault.wallet);
  });

  mockInvestmenstData.investments.forEach(investment => {
    // Check if the vault already has an entry in the map
    if (!moneyInvestedByVaultMap.has(investment.vaultId)) {
      // If not, initialize the map entry with the current investment amount
      moneyInvestedByVaultMap.set(investment.vaultId, investment.moneyInvested);

      // Create a new WalletVaultInfo and push it to the result array
      const walletVaultInfo: WalletVaultInfo = {
        vaultId: investment.vaultId,
        wallet: vaultIdToWalletMap.get(investment.vaultId) ?? "0x0",
      };
      totalInvestmentPerVault.push(walletVaultInfo);
    } else {
      // If the vault already has an entry, update the total investment
      const currentInvestment = moneyInvestedByVaultMap.get(investment.vaultId) ?? 0;
      const totalMoney = currentInvestment + investment.moneyInvested;

      // Update the map with the new total
      moneyInvestedByVaultMap.set(investment.vaultId, totalMoney);
    }
  });

  // Optional: Log the results for debugging
  moneyInvestedByVaultMap.forEach((value, key) => {
    console.log(`Vault ID: ${key}, Total Money: ${value}`);
  });

  console.log("wallets invested: " + JSON.stringify(totalInvestmentPerVault, null, 2));

  const myInvestments: Investment[] = [];
  totalInvestmentPerVault.forEach(async walletVaultInfo => {
    const DATA_QUERY_OPORTUNITIES = gql`
  query MyQuery {
    positions(where: { owner: "${walletVaultInfo.wallet}"}) {
      id
      collectedFeesToken0
      collectedFeesToken1
      depositedToken0
      depositedToken1
      liquidity
      collectedToken0
      collectedToken1
      withdrawnToken0
      withdrawnToken1
      transaction {
        timestamp
      }
      token1 {
       symbol
       id
      }
      token0 {
       symbol
      id
    }
    }
  }
`;

    const investmentsFromUniswap = await client.query(DATA_QUERY_OPORTUNITIES, {}).toPromise();

    let liquidity = BigInt(0);
    let fees = 0;
    investmentsFromUniswap.data.positions.forEach((position: any) => {
      liquidity += position.liquidity;
      fees += position.collectedFeesToken0 + position.collectedFeesToken1;
      position.token0.symbol;
    });
    const myInvestment: Investment = {
      liquidity: (convertWeiToEth(liquidity) * 2598) / 1000, // Example value for liquidity
      fees: fees, // Example value for fees
      apr: 8.5, // Example value for APR (Annual Percentage Rate)
      vaultId: walletVaultInfo.vaultId, // Example value for Vault ID
      pnl: 250, // Example value for PnL (Profit and Loss)
      moneyInvested: moneyInvestedByVaultMap.get(walletVaultInfo.vaultId) ?? 0,
    };
    myInvestments.push(myInvestment);
  });

  return myInvestments;
}

function convertWeiToEth(weiAmount: bigint): number {
  // 1 ETH = 10^18 wei
  const ethAmount = Number(weiAmount) / 1e18;

  return ethAmount;
}

// Define a Card component to display each position
const CardInvestments = ({ investment }: { investment: Investment }) => {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onStartCopying = async () => {
    console.log("Copying position");
    console.log(isPending);

    const contract = getContract({
      client: thirdWebClient,
      chain: baseSepolia,
      address: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
    });

    const transaction = prepareContractCall({
      contract: contract,
      method: "function mint(address to)",
      params: ["0xe306a371917E7e17759FCd7b5905C0624aF2e215"],
      value: BigInt(1000),
    });

    sendTransaction(transaction);
  };

  return (
    <div className="card bg-base-100 shadow-xl m-10">
      <div className="card-body">
        <h2 className="card-title">Vault #{investment.vaultId} - @camilosaka</h2>
     
        {/**<p>Liquidity: $ {investment.liquidity.toFixed(3)} USD</p>**/}
        {<p>Initial Investment: {investment.moneyInvested} USDC</p>}
        {/**<p>Pnl: $ {investment.pnl} USD</p>**/}
       
        {<p>Earned fees: $ {0} USDC</p>}
        {<p>Claimed fees: $ {0} USDC</p>}
        {<p>PnL: $ {0} USDC</p>}
        {/**
        <p>Transaction Timestamp: {new Date(position.transaction.timestamp * 1000).toLocaleString()}</p>
        **/}
        <div className="card-actions justify-end">
           <p>You can close position on Aug 30</p>
          {<button className="btn btn-primary" onClick={onStartCopying} disabled>
            Close Position
          </button>}
          <button className="btn btn-primary" onClick={onStartCopying}>
            Collect fees
          </button>
        </div>
      </div>
    </div>
  );
};

// Define a Card component to display each position
const CardVaults = ({ vault }: { vault: any }) => {
  const { mutate: sendTransaction1, isPending } = useSendTransaction({
    payModal: {
      supportedTokens: {
        "84532": [
          {
            address: "0x7de9a0c146Cc6A92F2592C5E4e2331B263De88B1",
            name: "USDC",
            symbol: "MUSDC",
            icon: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
          },
        ],
      },
    },
  });

  const account = useActiveAccount();
  console.log("account" + account);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const onStartCopying = async () => {
    console.log("Copying position");
    console.log(isPending);

    /*const contract = getContract({
      client: thirdWebClient,
      chain: baseSepolia,
      address: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
    });

  */
    const contract = getContract({
      client: thirdWebClient,
      chain: baseSepolia,
      address: "0x7de9a0c146Cc6A92F2592C5E4e2331B263De88B1",
    });

    const transaction = prepareContractCall({
      contract: contract,
      method: "function transfer(address to, uint256 value)",
      params: ["0x2170bc5E5eeb2bbF3172AbF2716D8BBB729D2ab6", BigInt(250000000)],
      //value: toWei("0.00001"),
    });

    /*const { transactionHash } = await sendTransaction({
      account,
      transaction
    });*/


    const { transactionHash } = await sendTransaction({
      account,
      transaction
    });
    console.log(transactionHash)
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl m-10">
        <div className="card-body">
          <h2 className="card-title">Vault # {vault.vaultId} - @camilosaka</h2>
          <p>Expected APR {vault.expectedAPR}%</p>
          <p>Minimum Investment: $ {vault.minimumInvestment} USDC</p>
          <p>Strategy: {vault.strategy}</p>
          <p>Vault fee: {vault.vaultFee}%</p>
          {/**
        <p>Transaction Timestamp: {new Date(position.transaction.timestamp * 1000).toLocaleString()}</p>
        **/}
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={onStartCopying}>
              Invest
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

const Home: NextPage = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(STATE_VAULTS);

  const {
    data: result,
  } = useReadContract({
    address: "0x5C96c04768a5BeA3D2509342A2ac5a78bAe4143C",
    abi: externalContracts[84532]?.[0]?.contracts.CopyFarming.abi,
    functionName: "getVaultsList",
    chainId: baseSepolia.id,
  });

  const vaultList = result?.map((item: any) => ({
    vaultId: BigInt(item.vaultId),
    startDate: BigInt(item.startDate),
    state: item.state, // Assuming the state is returned as an integer or enum
    moneyAdded: BigInt(item.moneyAdded),
    expectedAPR: BigInt(item.expectedAPR),
    minimumInvestment: BigInt(item.minimumInvestment),
    strategy: item.strategy,
    vaultFee: BigInt(item.vaultFee),
    trader: {
      traderWallet: item.trader.traderWallet,
      nickname: item.trader.nickname,
    },
    investors: BigInt(item.investors),
    moneyEarned: BigInt(item.moneyEarned),
    moneyClaimed: BigInt(item.moneyClaimed),
  }));

  console.log(vaultList);


  useEffect(() => {
    getCurrentInvestments().then(results => {
      setInvestments(results);
    });
  }, []);

  const account = useActiveAccount();

  useEffect(() => {
    if (account == undefined) {
      onDisconnect();
    }
  }, [account]);

  const router = useRouter();

  const onDisconnect = () => {
    router.push("/login", { scroll: false });
  };


  return (
    <>
      {account && (
        <div className="mt-5 pl-2">
          <ConnectButton
            client={thirdWebClient}

            onDisconnect={onDisconnect}
            chain={baseSepolia}
            supportedTokens={{
              // when connected to "Base" mainnet - show balance of DAI stablecoin
              84532: [
                {
                  address: '0x7de9a0c146Cc6A92F2592C5E4e2331B263De88B1', // token contract address
                  name: 'USDC',
                  symbol: 'USDT',
                  icon: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
                },
              ],
            }}
            detailsModal={{
              showTestnetFaucet: false,
              payOptions: {
                mode: "fund_wallet",
                // Provide FundWalletOptions related configuration here
                // For example:
                //buyWithCrypto: false,
                //buyWithFiat: false,
              },
            }}
          ></ConnectButton>
        </div >
      )}
      <div role="tablist" className="tabs tabs-lifted mt-5">
        <a
          role="tab"
          className={`tab ${selectedTab === STATE_VAULTS ? "tab-active" : ""}`}
          onClick={() => setSelectedTab(STATE_VAULTS)}
        >
          Opportunities
        </a>
        <a
          role="tab"
          className={`tab ${selectedTab === STATE_INVESTMENTS ? "tab-active" : ""}`}
          onClick={() => setSelectedTab(STATE_INVESTMENTS)}
        >
          Investments
        </a>
      </div >
      {
        selectedTab === STATE_VAULTS && (
          <div className="card-container">
            <ul>
              {mockVaultsData.availableVaults.map(vault => (
                <li key={vault.vaultId}>
                  <CardVaults key={vault.vaultId} vault={vault} />
                </li>
              ))}
            </ul>
          </div>
        )
      }

      {
        selectedTab === STATE_INVESTMENTS && (
          <div>
            {investments.length == 0 && (
              <div className="card-container">
                <p>You don&apos;t have any copied position</p>
              </div>
            )}
            {investments.length != 0 && (
              <div className="card-container">
                {investments.map(investment => (
                  <CardInvestments key={investment.vaultId} investment={investment} />
                ))}
              </div>
            )}
          </div>
        )
      }
    </>
  );
};

export default Home;
