"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { thirdWebClient } from "~~/app/client";

export default function Page() {
  const router = useRouter();
  const account = useActiveAccount();
  useEffect(() => {
    if (account != undefined) {
      router.push("/", { scroll: false });
    }
  }, [account]);

  return (
    <>
      <div className="background">
        <h1 className="font-h1">
          Let the best Copy Farming <br></br> Trade for you
        </h1>
        <div className="flex justify-center items-center h-screen">
          <ConnectEmbed client={thirdWebClient} chain={sepolia}></ConnectEmbed>
        </div>
      </div>
    </>
  );
}
