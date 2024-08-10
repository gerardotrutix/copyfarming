"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cacheExchange, fetchExchange } from "@urql/core";
import type { NextPage } from "next";
import { toWei } from "thirdweb";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { useSendTransaction } from "thirdweb/react";
import { createClient, gql } from "urql";
import { thirdWebClient } from "~~/app/client";

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
      expectedAPR: 4.8,
      minimumInvestment: 500,
      strategy: "Yield Farming on Uniswap",
      vaultFee: 50,
    },
    {
      vaultId: 3,
      wallet: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyAdded: 100000,
      expectedAPR: 4.8,
      minimumInvestment: 500,
      strategy: "Yield Farming on Uniswap",
      vaultFee: 50,
    },
  ],
};

const mockInvestmenstData = {
  investments: [
    {
      investmentId: 1,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 1000,
      vaultId: 1,
    },
    {
      investmentId: 3,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 1000,
      vaultId: 1,
    },
    {
      investmentId: 3,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 250,
      vaultId: 1,
    },
    {
      investmentId: 3,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 40000,
      vaultId: 1,
    },
    {
      investmentId: 2,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 2000,
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
      chain: sepolia,
      address: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
    });

    const transaction = prepareContractCall({
      contract: contract,
      method: "function mint(address to)",
      params: ["0xe306a371917E7e17759FCd7b5905C0624aF2e215"],
      value: toWei("0.001"),
    });

    sendTransaction(transaction);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl p-2">
      <div className="card-body">
        <h2 className="card-title">Vault #{investment.vaultId}</h2>
        <p>Current APR: {investment.apr}</p>
        <p>Liquidity: $ {investment.liquidity.toFixed(3)} USD</p>
        <p>Pnl: {investment.pnl}</p>
        <p>Initial Investment: $ {investment.moneyInvested} USD</p>
        {/**
        <p>Transaction Timestamp: {new Date(position.transaction.timestamp * 1000).toLocaleString()}</p>
        **/}
        <div className="card-actions justify-end">
          {/**<button className="btn btn-primary" onClick={onStartCopying}>
            Close Position
          </button>**/}
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
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onStartCopying = async () => {
    console.log("Copying position");
    console.log(isPending);

    const contract = getContract({
      client: thirdWebClient,
      chain: sepolia,
      address: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
    });

    const transaction = prepareContractCall({
      contract: contract,
      method: "function mint(address to)",
      params: ["0xe306a371917E7e17759FCd7b5905C0624aF2e215"],
      value: toWei("0.001"),
    });

    sendTransaction(transaction);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl mb-20 mt-10">
      <div className="card-body">
        <h2 className="card-title">Vault # {vault.vaultId}</h2>
        <p>Expected APR {vault.expectedAPR}%</p>
        <p>Minimun Invest: {vault.minimumInvestment}</p>
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
  );
};

const Home: NextPage = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(STATE_VAULTS);

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
        <ConnectButton
          client={thirdWebClient}
          onDisconnect={onDisconnect}
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
      )}
      <div role="tablist" className="tabs tabs-lifted">
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
      </div>

      {selectedTab === STATE_VAULTS && (
        <div className="card-container">
          <ul>
            {mockVaultsData.availableVaults.map(vault => (
              <li key={vault.vaultId}>
                <CardVaults key={vault.vaultId} vault={vault} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === STATE_INVESTMENTS && (
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
      )}
    </>
  );
};

export default Home;
