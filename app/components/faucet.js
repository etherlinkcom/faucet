import Image from "next/image";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import {
  ConnectWallet,
  lightTheme,
  useChainId,
  useAddress,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { ClaimButton } from "./claimButton";
import { AddTokenToWalletButton } from "./addTokenToWallet"

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
    { name: 'Wrapped Eth', symbol: 'ETH', address: '0x8DEF68408Bc96553003094180E5C90d9fe5b88C1', decimals: 18, logo: '/img/tokens/WETH.png' },
    { name: 'tzBTC', symbol: 'BTC', address: '0x6bDE94725379334b469449f4CF49bCfc85ebFb27', decimals: 18, logo: '/img/tokens/TZBTC.png' },
  ];


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
                <td className="px-6 text-sm font-medium text-white">
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
                <td className="px-6 whitespace-nowrap text-sm text-white flex justify-center items-center mt-1">
                  <ClaimButton
                    tokenAddress={token.address}
                    walletStatus={walletStatus}
                    captchaCompleted={captchaCompleted}
                    chainId={chainId}
                    address={address}
                  />
                </td>
                <td className="px-6 whitespace-nowrap text-sm text-white">
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



