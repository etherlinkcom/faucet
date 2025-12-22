export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { enqueue } from './queue';

const usedRecaptchaTokens = new Set();

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
    if (!verifyData.success) return false;

    usedRecaptchaTokens.add(recaptchaToken);
    return true;
}

export async function POST(request) {
    try {
        const response = await enqueue(async () => {
        const { walletAddress, tokenAddress, amount, recaptchaToken } = await request.json();

        const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';
        const recaptchaSuccess = isStaging || await verifyRecaptcha(recaptchaToken);
        if (!recaptchaSuccess) {
            return NextResponse.json(
                { error: "reCAPTCHA failed" },
                { status: 400 }
            );
        }

        const privateKey = process.env.PRIVATE_KEY;
        const rpcUrl = process.env.NEXT_PUBLIC_NETWORK === "shadownet" ?
            "https://node.shadownet.etherlink.com" :
            "https://node.ghostnet.etherlink.com"
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        if (tokenAddress === "") {
            const gasPrice = await wallet.provider.getGasPrice()
            const transaction = {
                to: walletAddress,
                value: ethers.utils.parseEther(amount),
                gasPrice: gasPrice
            };
            const txResponse = await wallet.sendTransaction(transaction);
            const receipt = await txResponse.wait();
            return NextResponse.json(
                { body: { receipt } },
                { status: 200 },
            );
        } else {
            const abi = [
                "function transfer(address to, uint256 value) returns (bool)",
                "function decimals() pure returns (uint256)"
            ];
            const erc20Contract = new ethers.Contract(tokenAddress, abi, wallet);
            const decimals = await erc20Contract.decimals()

            const amountToSend = ethers.utils.parseUnits(amount, decimals);
            const txResponse = await erc20Contract.transfer(
                walletAddress,
                amountToSend,
            );
            const receipt = await txResponse.wait();
            return NextResponse.json(
                { body: { receipt } },
                { status: 200 },
            );
        }
    });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { body: "error" },
            { status: 500 },
        );
    }
}
