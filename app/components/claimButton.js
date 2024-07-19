import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

export const ClaimButton = ({ tokenAddress, walletStatus, captchaCompleted, chainId, address, amount }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [rateLimited, setRateLimited] = useState(false)

    useEffect(() => {
        if (txHash) {
            setIsLoading(false);
        }
    }, [txHash]);



    const callFaucet = async (tokenAddress, amount) => {
        const RATE_LIMIT_INTERVAL = 24 * 60 * 60 * 1000; // 1 Day
        const lastCall = localStorage.getItem(`faucetCallTimestamp_${tokenAddress}`);
        const now = Date.now();

        if (lastCall && (now - lastCall) < RATE_LIMIT_INTERVAL) {
            setRateLimited(true)
            toast.error('Must wait 1 day before claiming testnet tokens.');
            return;
        }

        setIsLoading(true);
        const body = JSON.stringify({ walletAddress: address, tokenAddress: tokenAddress, amount: amount });
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
                        () => callFaucet(tokenAddress, amount)}
                disabled={isLoading || !captchaCompleted || rateLimited}
                className={`
                    flex flex-row items-center justify-center
                    text-sm font-medium text-center text-black
                    border-solid border-2 border-black rounded-md px-2
                    py-1  hover:border-black
                    ${isLoading || !captchaCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isLoading || txHash ? "px-4" : "px-2"}
                    ${rateLimited ? "opacity-50 cursor-not-allowed bg-red-500" : "bg-zinc-200 hover:bg-darkGreen hover:text-white"}
                `}
            >
                {isLoading ? <>
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
                    `Send`}
                <Toaster />
            </button> : ""
    )
}