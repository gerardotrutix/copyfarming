"use client";

import { useEffect } from "react";
import { useState } from "react";
import { cacheExchange, fetchExchange } from "@urql/core";
import type { NextPage } from "next";
import { createClient, gql } from "urql";

const STATE_OPPORTUNITIES = 0;
const STATE_INVESTMENTS = 1;

const client = createClient({
  url: "https://gateway-arbitrum.network.thegraph.com/api/a26da39d06ecbf637c8b1ba4fe5659f9/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
  exchanges: [cacheExchange, fetchExchange],
});

const DATA_QUERY_OPORTUNITIES = gql`
  query MyQuery {
    positions(where: { owner: "0x0a25C91209a158D0a4922837cdd590aCe0D13f0d" }) {
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

async function getResults() {
  const result = await client.query(DATA_QUERY_OPORTUNITIES, {}).toPromise();

  console.log(result.data);

  return result;
}

// Define a Card component to display each position
const Card = ({ position }: { position: any }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl p-2">
      <div className="card-body">
        <h2 className="card-title">{position.id}</h2>
        <p>Collected Fees Token 0: {position.collectedFeesToken0}</p>
        <p>Collected Fees Token 1: {position.collectedFeesToken1}</p>
        <p>Deposited Token 0: {position.depositedToken0}</p>
        <p>Deposited Token 1: {position.depositedToken1}</p>
        <p>Liquidity: {position.liquidity}</p>
        <p>Collected Token 0: {position.collectedToken0}</p>
        <p>Collected Token 1: {position.collectedToken1}</p>
        <p>Withdrawn Token 0: {position.withdrawnToken0}</p>
        <p>Withdrawn Token 1: {position.withdrawnToken1}</p>
        {/**
       
        
      
      
        <p>Transaction Timestamp: {new Date(position.transaction.timestamp * 1000).toLocaleString()}</p>
        **/}
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Copy Position</button>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(STATE_OPPORTUNITIES);

  useEffect(() => {
    console.log("hellooo");
    getResults().then(results => {
      setPositions(results.data.positions);
    });
  }, []);

  return (
    <>
      <div role="tablist" className="tabs tabs-boxed">
        <a
          role="tab"
          className={`tab ${selectedTab === STATE_OPPORTUNITIES ? "tab-active" : ""}`}
          onClick={() => setSelectedTab(STATE_OPPORTUNITIES)}
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

      {selectedTab === STATE_OPPORTUNITIES && (
        <div className="card-container">
          {positions.map(position => (
            <Card key={position.id} position={position} />
          ))}
        </div>
      )}

      {selectedTab === STATE_INVESTMENTS && (
        <div className="card-container">
          <p>Caca</p>
        </div>
      )}
    </>
  );
};

export default Home;
