import { useEffect, useState } from "react";
import Image from "next/image";

export const ClaimButton = ({ tokenAddress, walletStatus, captchaCompleted, chainId, address }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [waitMessage, setWaitMessage] = useState("")

    useEffect(() => {
        if (txHash) {
            setIsLoading(false);
        }
    }, [txHash]);

    const callFaucet = async (tokenAddress) => {
        const RATE_LIMIT_INTERVAL = 24 * 60 * 60 * 1000; // 1 Day
        const lastCall = localStorage.getItem(`faucetCallTimestamp_${tokenAddress}`);
        const now = Date.now();

        if (lastCall && (now - lastCall) < RATE_LIMIT_INTERVAL) {
            setWaitMessage(`${Math.ceil(((RATE_LIMIT_INTERVAL - (now - lastCall)) / 1000 / 60 / 60))} hours`);
            return;
        }

        setIsLoading(true);
        const body = JSON.stringify({ walletAddress: address, tokenAddress: tokenAddress });
        const response = await fetch('/api/faucet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (response.ok) {
            const data = await response.json();
            setTxHash(data.body.receipt.transactionHash);
            localStorage.setItem(`faucetCallTimestamp_${tokenAddress}`, now);
        } else {
            console.error('Error:', response.status);
        }

    }

    return (
        walletStatus === "connected" && chainId === 128123 ?
            <button
                onClick={
                    txHash ?
                        () => window.open(`https://testnet-explorer.etherlink.com/tx/${txHash}`, '_blank') :
                        () => callFaucet(tokenAddress)}
                disabled={isLoading || !captchaCompleted}
                className={`
            flex flex-row items-center justify-center
            text-sm font-medium text-center text-black
            bg-zinc-200 border-solid border-2 border-black rounded-md px-2
            py-1 hover:bg-darkGreen hover:border-black
            hover:text-white ${isLoading || !captchaCompleted || waitMessage !== "" ? 'opacity-50 cursor-not-allowed' : ''}
            ${isLoading || txHash ? "px-4" : "px-2"}
            `}
            >
                {waitMessage !== "" ? <>
                    {waitMessage}
                </> :
                    isLoading ? <>
                        <Image
                            src="/img/home/logo.png"
                            alt="Loading..."
                            width={32}
                            height={32}
                            className={`w-8 mr-2 ${isLoading ? 'spin-logo' : ''}`}
                        />
                        Loading...
                    </> : txHash ?
                        <>
                            <Image
                                src="/img/home/logo.png"
                                alt="logo"
                                width={32}
                                height={32}
                                className="w-8 mr-2"
                            />
                            {`${txHash.slice(0, 6)}`}
                        </> :
                        `Send 1`}
            </button> : ""
    )
}