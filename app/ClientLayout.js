"use client"

import { ThemeProvider } from "next-themes";
import { FaucetProvider } from "./contexts/FaucetContext";
import { metamaskWallet, rabbyWallet, ThirdwebProvider, walletConnect } from "@thirdweb-dev/react";
import { EtherlinkTestnet } from "@thirdweb-dev/chains"
import "../public/css/tailwind.css";


function ThirdWebConfig({ children }) {

  const dAppMeta = {
    name: "Etherlink Testnet Faucet",
    description: "Drip Testnet XTZ",
    logoUrl: "https://etherlink.com/logo.png",
    url: "https://etherlink.com",
    isDarkMode: true,
  };

  return (
    <ThirdwebProvider clientId={process.env.THIRDWEB_CLIENT_ID}
      activeChain={EtherlinkTestnet}
      supportedChains={[EtherlinkTestnet]}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        walletConnect(),
        rabbyWallet()
        // localWallet(),
        // embeddedWallet({
        //   auth: {
        //     options: ["email", "apple", "google"],
        //   },
        // }),
        // phantomWallet({ recommended: true }), // Doesn't support Etherlink yet
      ]}
      dAppMeta={dAppMeta}>
      {children}
    </ThirdwebProvider>
  );
}

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <FaucetProvider>
        <ThirdWebConfig>
          {children}
        </ThirdWebConfig>
      </FaucetProvider>
    </ThemeProvider>
  );
}
