import Image from "next/image"
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import {
  ConnectWallet,
  lightTheme,
  useChainId,
  useAddress,
  useConnectionStatus,
} from "@thirdweb-dev/react";

const customTheme = lightTheme({
  colors: {
    primaryText: 'black',
    primaryButtonBg: '#38ff9c',
    primaryButtonText: 'black',
    secondaryButtonBg: '#59ad8c',
    connectedButtonBgHover: '#59ad8c',
    borderColor: '#59ad8c'
  },
});

const Faucet = () => {
  const [captchaCompleted, setCaptchaCompleted] = useState(false);

  const address = useAddress();
  const walletStatus = useConnectionStatus();
  const chainId = useChainId();

  const tokens = [
    { name: 'Wrapped XTZ', symbol: 'WXTZ', address: '0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8', decimals: 18, logo: '/img/home/logo.png' },
    { name: 'Iguana Token', symbol: 'IGN', address: '0xBeEfb119631691a1e0D9378fA7864fC6E67A72Ad', decimals: 18, logo: '/img/tokens/IGUANA.avif' },
    { name: 'Etherlink USD', symbol: 'eUSD', address: '0x1A71f491fb0Ef77F13F8f6d2a927dd4C969ECe4f', decimals: 18, logo: '/img/tokens/EUSD.png' },
    { name: 'Tether USD', symbol: 'USDT', address: '0xD21B917D2f4a4a8E3D12892160BFFd8f4cd72d4F', decimals: 18, logo: '/img/tokens/USDT.png' },
    { name: 'USD Coin', symbol: 'USDC', address: '0xa7c9092A5D2C3663B7C5F714dbA806d02d62B58a', decimals: 18, logo: '/img/tokens/USDC.png' },
    { name: 'Wrapped Eth', symbol: 'WETH', address: '0x8DEF68408Bc96553003094180E5C90d9fe5b88C1', decimals: 18, logo: '/img/tokens/WETH.png' },
    { name: 'tzBTC', symbol: 'tzBTC', address: '0x6bDE94725379334b469449f4CF49bCfc85ebFb27', decimals: 18, logo: '/img/tokens/TZBTC.png' },
  ];


  const addTokenToMetamask = async (token) => {
    try {
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.image, // TODO change to url
          },
        },
      });

    } catch (error) {
      console.log(error);
    }
  }
  const AddTokenToWalletButton = ({ token }) => {
    return (
      <button
        onClick={() => addTokenToMetamask(token)}
        className={`
          flex flex-row items-center justify-center
          py-3 text-lg font-medium text-center text-black
          bg-zinc-200 border-solid border-2 border-black rounded-md px-7
          lg:px-2 lg:py-1 hover:bg-darkGreen hover:border-black
          hover:text-white
        `}
      >
        Add to Wallet
      </button>
    );
  };



  const ConnectWalletButton = () => {
    return (
      <ConnectWallet
        switchToActiveChain={true}
        theme={customTheme}
        modalSize={"wide"}
      // btnTitle="Connect Etherlink To Metamask"
      />
    )
  }

  const ClaimButton = ({ tokenAddress, walletStatus, captchaCompleted }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState("");

    const callFaucet = async (tokenAddress) => {
      const body = JSON.stringify({ walletAddress: address, tokenAddress: tokenAddress });
      setIsLoading(true);
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
      } else {
        console.error('Error:', response.status);
      }
    }

    return (
      walletStatus === "connected" && chainId === 128123 ?
        <button
          onClick={txHash ? () => window.open(`https://testnet-explorer.etherlink.com/tx/${txHash}`, '_blank') : () => callFaucet(tokenAddress)}
          disabled={isLoading || !captchaCompleted}
          className={`
            flex flex-row items-center justify-center
            py-3 text-lg font-medium text-center text-black
            bg-zinc-200 border-solid border-2 border-black rounded-md px-7
            lg:px-2 lg:py-1 hover:bg-darkGreen hover:border-black
            hover:text-white ${isLoading || !captchaCompleted ? 'opacity-50 cursor-not-allowed' : ''}
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
              {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
            </> :
            `Send 1`}
        </button> : ""
    )
  }

  const TokenButtonsTable = ({ tokens, walletStatus, captchaCompleted }) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-zinc-600 bg-black-800 text-center">
          <thead className="bg-black-800">
            <tr>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Token Name
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Token Symbol
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Token Address
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Add To Wallet
              </th>
            </tr>
          </thead>
          <tbody className="bg-black-800 divide-y divide-zinc-600">
            {tokens.map((token, index) => (
              <tr key={index} className="bg-black-800">
                <td className="px-6  text-sm font-medium text-white">
                  <Image
                    src={token.logo}
                    alt=''
                    width={32}
                    height={32}
                  />
                </td>
                <td className="px-6  text-sm font-medium text-white">{token.name}</td>
                <td className="px-6 whitespace-nowrap text-sm text-white">{token.symbol}</td>
                <td className="px-6 whitespace-nowrap text-sm text-white">{token.address}</td>
                <td className="px-6 whitespace-nowrap text-sm text-white flex justify-center items-center">
                  <ClaimButton
                    tokenAddress={token.address}
                    walletStatus={walletStatus}
                    captchaCompleted={captchaCompleted}
                  />
                </td>
                <td className="px-6 whitespace-nowrap text-sm text-white ">
                  <AddTokenToWalletButton token={token} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  };

  return (
    <div className="flex items-center justify-center w-full lg:w-1/2 min-w-1/2 rounded-lg mt-10 mb-10">
      <div className="min-w-2xl text-center lg:text-center">
        <div className="flex flex-col space-y-2 mb-10">
          <h1 className="text-white font-bold text-5xl">
            Get testnet XTZ on <span className="text-neonGreen">Etherlink</span>
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <ConnectWalletButton />
          {walletStatus === "connected" && chainId === 128123 && (
            <ReCAPTCHA
              sitekey="6Lcbu-AoAAAAAOPS85LI3sqIvAwErDKdtZJ8d1Xh"
              onChange={() => setCaptchaCompleted(true)}
              onExpired={() => setCaptchaCompleted(false)}
              className="mt-10 mb-10"
              theme="light"
            />
          )}
        </div>
        {walletStatus === "connected" && chainId === 128123 && (
          <TokenButtonsTable
            tokens={tokens}
            walletStatus={walletStatus}
            captchaCompleted={captchaCompleted}
          />
        )}
      </div>
    </div>
  );
}

export default Faucet;



