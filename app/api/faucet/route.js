import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { enqueue } from './queue';

export async function POST(request) {
    try {
        const response = await enqueue(async () => {
        const { walletAddress, tokenAddress, amount } = await request.json();
        console.log({walletAddress, tokenAddress, amount});
        const privateKey = process.env.PRIVATE_KEY;
        const rpcUrl = process.env.NEXT_PUBLIC_NETWORK === "shadownet" ?
            "https://node.shadownet.etherlink.com" :
            "https://node.ghostnet.etherlink.com"
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        // If XTZ
        if (tokenAddress === "") {
            const transaction = {
                to: walletAddress,
                value: ethers.utils.parseEther(amount),
                gasPrice: await wallet.provider.getGasPrice(),
            };
            const txResponse = await wallet.sendTransaction(transaction);
            const receipt = await txResponse.wait();
            return NextResponse.json(
                { body: { receipt } },
                { status: 200 },
            );
        } else {
            // Create ERC20 contract
            const abi = [
                "function transfer(address to, uint256 value) returns (bool)",
                "function decimals() pure returns (uint256)"
            ];
            const erc20Contract = new ethers.Contract(tokenAddress, abi, wallet);
            const decimals = await erc20Contract.decimals()

            // Send
            const amountToSend = ethers.utils.parseUnits(amount, decimals);
            const txResponse = await erc20Contract.transfer(walletAddress, amountToSend);
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
