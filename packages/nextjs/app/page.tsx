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
      investmentId: 1,
      investor: "0xe306a371917E7e17759FCd7b5905C0624aF2e215",
      moneyInvested: 2000,
      vaultId: 1,
    },
  ],
};

/**
let MY_WALLET= "0x0a25C91209a158D0a4922837cdd590aCe0D13f0d"

 
const DATA_QUERY_INVESTMENTS = gql`
  query MyQuery {
    positions(where: { owner: "${MY_WALLET}" }) {
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
    }
  }
`;
*/

interface Investment {
  liquidity: number;
  fees: number;
  apr: number;
  vaultId: number;
  pnl: number;
}

interface WalletVaultInfo {
  vaultId: number;
  wallet: string;
}

async function getCurrentInvestments() {
  //const investmentsFromUniswap = await client.query(DATA_QUERY_OPORTUNITIES, {}).toPromise();

  // Get the wallets that have invested in the vaults
  const walletsInvested: WalletVaultInfo[] = [];
  mockInvestmenstData.investments.forEach(investment => {
    mockVaultsData.availableVaults.forEach(vault => {
      if (investment.vaultId == vault.vaultId) {
        const walletVaultInfo: WalletVaultInfo = {
          vaultId: investment.vaultId,
          wallet: investment.investor,
        };
        walletsInvested.push(walletVaultInfo);
      }
    });
  });

  const myInvestments: Investment[] = [];
  walletsInvested.forEach(async walletVaultInfo => {
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

    let liquidity = 0;
    let fees = 0;
    investmentsFromUniswap.data.positions.forEach((position: any) => {
      liquidity += position.liquidity;
      fees += position.collectedFeesToken0 + position.collectedFeesToken1;
    });
    const myInvestment: Investment = {
      liquidity: liquidity, // Example value for liquidity
      fees: fees, // Example value for fees
      apr: 8.5, // Example value for APR (Annual Percentage Rate)
      vaultId: walletVaultInfo.vaultId, // Example value for Vault ID
      pnl: 250, // Example value for PnL (Profit and Loss)
    };
    myInvestments.push(myInvestment);
  });

  return myInvestments;
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
        <p>Liquidity: {investment.liquidity}</p>
        <p>Pnl: {investment.pnl}</p>
        {/**
        <p>Transaction Timestamp: {new Date(position.transaction.timestamp * 1000).toLocaleString()}</p>
        **/}
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={onStartCopying}>
            Close Position
          </button>
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
