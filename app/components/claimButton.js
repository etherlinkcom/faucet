import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import { blockExplorer, id } from "../config/thirdwebConfig";

export const ClaimButton = ({ tokenAddress, captchaCompleted, chainId, address, amount }) => {
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


        const body = JSON.stringify({
            walletAddress: address,
            tokenAddress: tokenAddress,
            amount: amount ,
            recaptchaToken: captchaCompleted

        });
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
            toast.error('An error occurred requesting tokens.');
            setIsLoading(false)
            console.error('Error:', response.status);
        }

    }

    return (
        address && chainId === id ?
            <button
                onClick={
                    txHash ?
                        () => window.open(`${blockExplorer}/tx/${txHash}`, '_blank') :
                        () => callFaucet(tokenAddress, amount)}
                disabled={isLoading || !captchaCompleted || rateLimited}
                className={`
                    flex flex-row items-center justify-center
                    text-sm font-medium text-center text-black
                    border-solid border-2 border-black rounded-md
                    w-full md:w-20 h-8 overflow-hidden
                    ${isLoading || !captchaCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                    ${rateLimited ? "opacity-50 cursor-not-allowed bg-red-500" : "bg-zinc-200 hover:bg-darkGreen hover:text-white"}
                `}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <Image
                            src="/img/home/logo.png"
                            alt="Loading..."
                            width={32}
                            height={32}
                            className={`w-8 mr-2 ${isLoading ? 'spin-logo' : ''}`}
                        />
                    </div>
                ) : txHash ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <Image
                            src="/img/home/logo.png"
                            alt="logo"
                            width={32}
                            height={32}
                            className="w-8 mr-2"
                        />
                        <span className="truncate">{`${txHash.slice(0, 6)}`}</span>
                    </div>
                ) : (
                    "Send"
                )}
                <Toaster />
            </button> : ""
    )
}