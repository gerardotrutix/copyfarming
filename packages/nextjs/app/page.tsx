"use client";

import { useEffect } from "react";
import { cacheExchange, fetchExchange } from "@urql/core";
import type { NextPage } from "next";
import { createClient, gql } from "urql";

const client = createClient({
  url: "https://gateway-arbitrum.network.thegraph.com/api/a26da39d06ecbf637c8b1ba4fe5659f9/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz",
  exchanges: [cacheExchange, fetchExchange],
});

const DATA_QUERY = gql`
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

async function getResults() {
  const result = await client.query(DATA_QUERY, {}).toPromise();

  console.log(result.data);

  return result;
}

const Home: NextPage = () => {
  useEffect(() => {
    console.log("hellooo");
    getResults().then(results => {
      console.log(results.data);
    });
  }, []);

  return (
    <>
      <p>Home: Results</p>
    </>
  );
};

export default Home;
