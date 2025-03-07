import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ConnectWallet,
  lightTheme,
  useConnectionStatus,
  useWallet
} from "@thirdweb-dev/react";

import { TokenButtonsTable } from "./TokenButtonsTable";

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

  const walletStatus = useConnectionStatus();
  const wallet = useWallet();

  const tokens = [
    { name: 'Tezos', symbol: 'XTZ', amount: '0.15', address: '0x', decimals: 18, logo: '/img/home/logo.png' },
    // { name: 'Wrapped XTZ', symbol: 'WXTZ', amount: '0.15', address: '0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8', decimals: 18, logo: '/img/home/logo.png' },
    // { name: 'Etherlink USD', symbol: 'eUSD', amount: '50', address: '0x1A71f491fb0Ef77F13F8f6d2a927dd4C969ECe4f', decimals: 18, logo: '/img/tokens/EUSD.png' },
    { name: 'Tether USD', symbol: 'USDT', amount: '50', address: '0xf7f007dc8Cb507e25e8b7dbDa600c07FdCF9A75B', decimals: 6, logo: '/img/tokens/USDT.png' },
    { name: 'USD Coin', symbol: 'USDC', amount: '50', address: '0x4C2AA252BEe766D3399850569713b55178934849', decimals: 6, logo: '/img/tokens/USDC.png' },
    { name: 'Wrapped Eth', symbol: 'WETH', amount: '0.1', address: '0x86932ff467A7e055d679F7578A0A4F96Be287861', decimals: 18, logo: '/img/tokens/WETH.png' },
    // { name: 'tzBTC', symbol: 'BTC', amount: '0.01', address: '0x6bDE94725379334b469449f4CF49bCfc85ebFb27', decimals: 18, logo: '/img/tokens/TZBTC.png' },
  ];


  const ConnectWalletButton = () => {
    return (
      <ConnectWallet
        switchToActiveChain={true}
        theme={customTheme}
        modalSize={"wide"}
      />
    )
  }


  return (
    <div className="flex items-center justify-center w-full lg:w-1/2 min-w-1/2 rounded-lg mt-10 mb-10">
      <div className="min-w-2xl text-center lg:text-center">
        <div className="flex flex-col space-y-2 mb-10">
          <h1 className="text-white font-bold text-5xl">
            Get testnet XTZ on <span className="text-newGreen">Etherlink</span>
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <ConnectWalletButton />
          {walletStatus === "connected"  && (
            <ReCAPTCHA
              sitekey="6Lcbu-AoAAAAAOPS85LI3sqIvAwErDKdtZJ8d1Xh"
              onChange={() => setCaptchaCompleted(true)}
              onExpired={() => setCaptchaCompleted(false)}
              className="mt-10 mb-10"
              theme="light"
            />
          )}
        </div>
        {walletStatus === "connected"  && (
          <TokenButtonsTable
            tokens={tokens}
            walletStatus={walletStatus}
            captchaCompleted={captchaCompleted}
            wallet={wallet}
          />
        )}
      </div>
    </div>
  );
}

export default Faucet;



