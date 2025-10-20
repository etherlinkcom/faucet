import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ConnectButton } from "thirdweb/react";
import { TokenButtonsTable } from "./TokenButtonsTable";
import { useActiveAccount } from "thirdweb/react";
import { chain, client } from "../config/thirdwebConfig";

const Faucet = () => {
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const account = useActiveAccount();

  return (
    <div className="flex items-center justify-center w-full lg:w-1/2 min-w-1/2 rounded-lg mt-10 mb-10">
      <div className="min-w-2xl text-center lg:text-center">
        <div className="flex flex-col space-y-2 mb-10">
          <h1 className="text-white font-bold text-5xl">
            Get testnet XTZ on <span className="text-newGreen">Etherlink</span>
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <ConnectButton client={client} chain={chain} />
          {account?.address && (
            <ReCAPTCHA
              sitekey="6Lcbu-AoAAAAAOPS85LI3sqIvAwErDKdtZJ8d1Xh"
              onChange={() => setCaptchaCompleted(true)}
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



