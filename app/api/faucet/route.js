export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { enqueue } from './queue';

const usedRecaptchaTokens = new Set();

const NETWORK_CONFIG = {
  shadownet: {
    rpcUrl: "https://node.shadownet.etherlink.com",
    name: "etherlink-shadownet",
    chainId: 127823,
  },
  ghostnet: {
    rpcUrl: "https://node.ghostnet.etherlink.com",
    name: "etherlink-ghostnet",
    chainId: 128123,
  },
};

async function verifyRecaptcha(recaptchaToken) {
    if (usedRecaptchaTokens.has(recaptchaToken)) return true;

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secret}&response=${recaptchaToken}`,
        }
    );

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
        console.log('[Faucet] reCAPTCHA verification failed');
        return false;
    }

    usedRecaptchaTokens.add(recaptchaToken);
    return true;
}

export async function POST(request) {
    try {
        const response = await enqueue(async () => {
        const { walletAddress, tokenAddress, amount, recaptchaToken } = await request.json();
        console.log(`[Faucet] Request: ${tokenAddress ? 'ERC20' : 'Native'} ${amount} to ${walletAddress}`);

        const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';
        const recaptchaSuccess = isStaging || await verifyRecaptcha(recaptchaToken);
        if (!recaptchaSuccess) {
            return NextResponse.json(
                { error: "reCAPTCHA failed" },
                { status: 400 }
            );
        }

        const networkType = process.env.NEXT_PUBLIC_NETWORK === "shadownet"
            ? "shadownet"
            : "ghostnet";
        const config = NETWORK_CONFIG[networkType];
        console.log(`[Faucet] Network: ${networkType}`);

        const provider = new ethers.providers.JsonRpcProvider(
            config.rpcUrl,
            { name: config.name, chainId: config.chainId }
        );
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        if (tokenAddress === "") {
            console.log('[Faucet] Sending native token');
            const gasPrice = await wallet.provider.getGasPrice();
            const transaction = {
                to: walletAddress,
                value: ethers.utils.parseEther(amount),
                gasPrice: gasPrice
            };
            const txResponse = await wallet.sendTransaction(transaction);
            console.log(`[Faucet] Tx sent: ${txResponse.hash}`);
            const receipt = await txResponse.wait();
            console.log(`[Faucet] Tx confirmed: ${receipt.transactionHash}`);
            return NextResponse.json(
                { body: { receipt } },
                { status: 200 },
            );
        } else {
            console.log(`[Faucet] Sending ERC20: ${tokenAddress}`);
            const abi = [
                "function transfer(address to, uint256 value) returns (bool)",
                "function decimals() pure returns (uint256)"
            ];
            const erc20Contract = new ethers.Contract(tokenAddress, abi, wallet);
            const decimals = await erc20Contract.decimals();

            const amountToSend = ethers.utils.parseUnits(amount, decimals);
            const txResponse = await erc20Contract.transfer(
                walletAddress,
                amountToSend,
            );
            console.log(`[Faucet] Tx sent: ${txResponse.hash}`);
            const receipt = await txResponse.wait();
            console.log(`[Faucet] Tx confirmed: ${receipt.transactionHash}`);
            return NextResponse.json(
                { body: { receipt } },
                { status: 200 },
            );
        }
    });

        return response;
    } catch (error) {
        console.error('[Faucet] Error:', error.message || error);
        return NextResponse.json(
            { body: "error" },
            { status: 500 },
        );
    }
}