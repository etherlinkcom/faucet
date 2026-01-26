import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import { blockExplorer, id } from "../config/thirdwebConfig";

export const ClaimButton = ({ tokenAddress, captchaCompleted, chainId, address, amount }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [rateLimited, setRateLimited] = useState(false);
    const [waitHours, setWaitHours] = useState(0);

    const isLocal = process.env.NEXT_PUBLIC_ENVIRONMENT === 'local';
    const buttonDisabled = (!captchaCompleted && !isLocal) || isLoading;

    useEffect(() => {
        if (txHash) {
            setIsLoading(false);
        }
    }, [txHash]);

    useEffect(() => {
        const checkRateLimit = () => {
            if (isLocal) return;
            const RATE_LIMIT_INTERVAL = 24 * 60 * 60 * 1000; // 1 Day
            const lastCall = localStorage.getItem(`faucetCallTimestamp_${tokenAddress}`);
            const now = Date.now();

            if (lastCall && (now - lastCall) < RATE_LIMIT_INTERVAL) {
                setRateLimited(true);
                const remaining = Math.ceil((RATE_LIMIT_INTERVAL - (now - lastCall)) / (60 * 60 * 1000));
                setWaitHours(remaining);
            } else {
                setRateLimited(false);
                setWaitHours(0);
            }
        }

        checkRateLimit();
        // Set up interval to check every minute? Not strictly necessary for "Hours" granularity but good practice
        const interval = setInterval(checkRateLimit, 60000);
        return () => clearInterval(interval);
    }, [tokenAddress, isLocal]);


    const callFaucet = async (tokenAddress, amount) => {
        const RATE_LIMIT_INTERVAL = 24 * 60 * 60 * 1000; // 1 Day
        const lastCall = localStorage.getItem(`faucetCallTimestamp_${tokenAddress}`);
        const now = Date.now();

        if (!isLocal && lastCall && (now - lastCall) < RATE_LIMIT_INTERVAL) {
            setRateLimited(true);
            const remaining = Math.ceil((RATE_LIMIT_INTERVAL - (now - lastCall)) / (60 * 60 * 1000));
            setWaitHours(remaining);
            toast.error(`Must wait ${remaining} hours before claiming testnet tokens.`);
            return;
        }

        setIsLoading(true);

        const body = JSON.stringify({
            walletAddress: address,
            tokenAddress: tokenAddress,
            amount: amount,
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
            setRateLimited(true);
            setWaitHours(24);
        } else {
            if (response.status === 429) {
                const errorData = await response.json();
                toast.error(errorData.error);

                if (errorData.remainingHours) {
                    const remaining = errorData.remainingHours;
                    const calculatedLastCall = Date.now() - (RATE_LIMIT_INTERVAL - (remaining * 60 * 60 * 1000));
                    localStorage.setItem(`faucetCallTimestamp_${tokenAddress}`, calculatedLastCall);

                    setRateLimited(true);
                    setWaitHours(remaining);
                }
            } else {
                toast.error('An error occurred requesting tokens.');
                console.error('Error:', response.status);
            }
            setIsLoading(false)
        }

    }

    return (
        address && chainId === id ?
            <button
                onClick={
                    txHash ?
                        () => window.open(`${blockExplorer}/tx/${txHash}`, '_blank') :
                        () => callFaucet(tokenAddress, amount)}
                disabled={buttonDisabled || (!txHash && rateLimited)}
                className={`
                    flex flex-row items-center justify-center
                    text-sm font-medium text-center
                    border-solid border-2 border-black rounded-md
                    w-full md:w-20 h-8 overflow-hidden
                    ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${rateLimited && !txHash ? "opacity-50 cursor-not-allowed bg-zinc-400 text-white border-zinc-500" : "text-black bg-zinc-200 hover:bg-darkGreen hover:text-white"}
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
                ) : rateLimited ? (
                    `Wait ${waitHours}h`
                ) : (
                    "Send"
                )}
                <Toaster />
            </button> : ""
    )
}