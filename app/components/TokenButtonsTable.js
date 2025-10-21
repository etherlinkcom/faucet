import Image from "next/image";
import { ClaimButton } from "./claimButton";
import { AddTokenToWalletButton } from "./addTokenToWallet";
import { useActiveWalletChain } from "thirdweb/react";
import { tokens } from "../config/tokens";

export const TokenButtonsTable = ({ captchaCompleted, address }) => {
  const chainId = useActiveWalletChain()?.id;

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full divide-y divide-zinc-600 bg-black-800 text-center">
          <thead className="bg-black-800">
            <tr>
              <th className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Image</th>
              <th className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Symbol</th>
              <th className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Address</th>
              <th className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Action</th>
              <th className="px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Add To Wallet</th>
            </tr>
          </thead>
          <tbody className="bg-black-800 divide-y divide-zinc-600">
            {tokens.map((token, index) => (
              <tr key={index} className="bg-black-800">
                <td className="px-6 text-sm font-medium text-white">
                  <Image src={token.logo} alt='' width={32} height={32} />
                </td>
                <td className="px-6 text-sm font-medium text-white">{token.name}</td>
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

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {tokens.map((token, index) => (
          <div key={index} className="bg-black-800 rounded-lg p-4 shadow border border-zinc-600">
            <div className="flex items-center gap-3 mb-2">
              <Image src={token.logo} alt='' width={32} height={32} />
              <span className="text-lg font-semibold text-white">{token.name}</span>
              <span className="ml-auto text-sm text-black bg-newGreen px-2 py-1 rounded">{token.symbol}</span>
            </div>
            <div className="text-xs text-zinc-300 mb-2 break-all">
              {token.address && <><span className="font-medium">Address:</span> {token.address}</>}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <ClaimButton
                tokenAddress={token.address}
                captchaCompleted={captchaCompleted}
                chainId={chainId}
                address={address}
                amount={token.amount}
              />
              <AddTokenToWalletButton token={token} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
