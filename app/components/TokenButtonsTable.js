import Image from "next/image";
import { ClaimButton } from "./claimButton";
import { AddTokenToWalletButton } from "./addTokenToWallet"
import { useActiveWalletChain } from "thirdweb/react";
import { tokens } from "../config/tokens";

export const TokenButtonsTable = ({ captchaCompleted, address }) => {

    const chainId = useActiveWalletChain()?.id;

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
                Name
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Symbol
              </th>
              <th
                scope="col"
                className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Address
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
                    captchaCompleted={captchaCompleted}
                    chainId={chainId}
                    address={address}
                    amount={token.amount}
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
