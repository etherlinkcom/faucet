import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ConnectButton } from "thirdweb/react";
import { TokenButtonsTable } from "./TokenButtonsTable";
import { useActiveAccount } from "thirdweb/react";
import { chain, client } from "../config/thirdwebConfig";
import { createWallet } from "thirdweb/wallets";

const Faucet = () => {
  const [captchaCompleted, setCaptchaCompleted] = useState();
  const account = useActiveAccount();

  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  return (
    <div className="flex items-center justify-center w-full lg:w-1/2 min-w-1/2 rounded-lg mt-10 mb-10">
      <div className="min-w-2xl text-center lg:text-center">
        <div className="flex flex-col space-y-2 mb-10">
          <h1 className="text-white font-bold text-5xl">
            Get <span className="text-newGreen">Etherlink</span>{" "}
            {process.env.NEXT_PUBLIC_NETWORK === "shadownet"
              ? "Shadownet Testnet Tokens"
              : "Testnet Tokens"}
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <ConnectButton
            client={client}
            chain={chain}
            wallets={wallets}
            />
          {account?.address && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaCompleted(token)}
              onExpired={() => setCaptchaCompleted(false)}
              className="mt-10 mb-10"
              theme="light"
            />
          )}
        </div>
        {account?.address && (
          <TokenButtonsTable
            captchaCompleted={captchaCompleted}
            address={account?.address}
          />
        )}
      </div>
    </div>
  );
}

export default Faucet;



