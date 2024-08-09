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
      <h1>Hello, Next.js!</h1>
      <ConnectEmbed client={thirdWebClient} chain={sepolia}></ConnectEmbed>
    </>
  );
}
