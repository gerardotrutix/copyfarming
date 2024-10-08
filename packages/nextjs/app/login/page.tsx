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
                <div className="title-container">
                    <h1 className="font-h1">
                        Let
                    </h1>
                    <h1 className="gradient-text">
                        the best crypto investors
                    </h1>
                    <h1 className="font-h1">
                        invest for you
                    </h1>
                </div>
                <div className="title-container">
                    <h1 className="font-h2">
                        We help people to access the best descentralized finance (DeFi) investment opportunities 
                    </h1>
                </div>
                <div className="title-container">
                    <h1 className="font-h2">
                    <b>Sign in and earn money now: </b>
                        <br></br>
                        <br></br>
                    </h1>
                </div>
                <div className="flex justify-center items-center ">
                    <ConnectEmbed client={thirdWebClient} chain={sepolia}></ConnectEmbed>
                </div>
                <br></br>
                <br></br>
            </div>
        </>
    );
}
