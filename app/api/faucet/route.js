export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { enqueue } from './queue';
import { tokens } from '../../config/tokens';
import { fetchJson } from '../../utils/fetchJson';

const usedRecaptchaTokens = new Set();

const NETWORK_CONFIG = {
    shadownet: {
        rpcUrl: "https://node.shadownet.etherlink.com",
        chainId: 127823,
        explorerApi: "https://shadownet.explorer.etherlink.com/api"
    },
    ghostnet: {
        rpcUrl: "https://node.ghostnet.etherlink.com",
        chainId: 128123,
        explorerApi: "https://testnet.explorer.etherlink.com/api"
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

async function checkCoolOff(walletAddress, tokenAddress, config, faucetAddress) {
    const isLocal = process.env.NEXT_PUBLIC_ENVIRONMENT === 'local';
    if (isLocal) return { allowed: true };
    const COOL_OFF_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
    const isNative = !tokenAddress;

    // Construct API URL
    const baseUrl = `${config.explorerApi}/v2/addresses/${walletAddress}`;
    let url;

    if (isNative) {
        url = `${baseUrl}/transactions?filter=to`;
    } else {
        url = `${baseUrl}/token-transfers?type=ERC-20`;
    }

    try {
        const data = await fetchJson(url);
        let lastClaim = null;

        if (isNative) {
            if (data.items && Array.isArray(data.items)) {
                lastClaim = data.items.find(tx =>
                    tx.from && tx.from.hash.toLowerCase() === faucetAddress.toLowerCase()
                );
            }
        } else {
            if (data.items && Array.isArray(data.items)) {
                lastClaim = data.items.find(tx =>
                    tx.from && tx.from.hash.toLowerCase() === faucetAddress.toLowerCase() &&
                    tx.token && tx.token.address.toLowerCase() === tokenAddress.toLowerCase()
                );
            }
        }

        if (lastClaim) {
            const lastClaimTime = Date.parse(lastClaim.timestamp);
            const now = Date.now();
            if (now - lastClaimTime < COOL_OFF_PERIOD) {
                const remaining = Math.ceil((COOL_OFF_PERIOD - (now - lastClaimTime)) / (60 * 1000 * 60));
                return { allowed: false, remainingHours: remaining, status: 429 };
            }
        }
        return { allowed: true, status: 200 }
    } catch (error) {
        console.error('[Faucet] Error checking history:', error);
    }
    return { allowed: false, status: 503 };
}

export async function POST(request) {
    try {
        const response = await enqueue(async () => {
            const { walletAddress, tokenAddress, recaptchaToken } = await request.json();

            const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                request.headers.get('x-real-ip') ||
                request.ip ||
                'unknown';

            // Find token in config to get the authorized amount
            const tokenConfig = tokens.find(t => t.address.toLowerCase() === (tokenAddress || "").toLowerCase());

            if (!tokenConfig) {
                console.log(`[Faucet] Unsupported token requested: ${tokenAddress}`);
                return NextResponse.json(
                    { error: "Unsupported token" },
                    { status: 400 }
                );
            }

            const amount = tokenConfig.amount.toString();
            console.log(`[Faucet] Request: ${tokenAddress ? 'ERC20 (' + tokenConfig.symbol + ')' : 'Native'} ${amount} to ${walletAddress} from ${ip}`);

            const isLocal = process.env.NEXT_PUBLIC_ENVIRONMENT === 'local';
            const recaptchaSuccess = isLocal || await verifyRecaptcha(recaptchaToken);
            if (!recaptchaSuccess) {
                return NextResponse.json(
                    { error: "reCAPTCHA failed or token reused" },
                    { status: 400 }
                );
            }

            const networkType = process.env.NEXT_PUBLIC_NETWORK === "shadownet"
                ? "shadownet"
                : "ghostnet";
            const config = NETWORK_CONFIG[networkType];
            console.log(`[Faucet] Network: ${networkType}`);

            const provider = new ethers.providers.JsonRpcProvider(
                {
                    url: config.rpcUrl,
                    skipFetchSetup: true,
                },
                config.chainId
            );
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

            // Check Cool-off
            const coolOffResult = await checkCoolOff(walletAddress, tokenConfig.address, config, wallet.address);

            const { allowed, remainingHours, status } = coolOffResult;
            if (!allowed) {
                if (remainingHours) console.log(`[Faucet] Cool-off active for ${walletAddress}. Remaining: ${remainingHours}h`);
                return NextResponse.json(
                    {
                        error: remainingHours ? `Please wait ${remainingHours} hours before next claim.` : "Error checking cool-off period",
                        remainingHours: remainingHours
                    },
                    { status: status || 500 }
                );
            }

            // 10 Second Wait
            console.log('[Faucet] Waiting 10 seconds...');
            await new Promise(resolve => setTimeout(resolve, 10000));

            if (tokenConfig.address === "") {
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