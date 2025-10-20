import { createThirdwebClient, defineChain } from "thirdweb";

export const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID});

let id = 128123;
let name = "Etherlink Testnet"
let rpc = "https://node.testnet.etherlink.com";
let blockExplorers = [{
    name: "Etherlink Testnet Explorer",
    url: "https://testnet.explorer.etherlink.com/"
}]
let faucets = ['https://faucet.etherlink.com/']

if (process.env.NEXT_PUBLIC_NETWORK === "shadownet") {
    id = 127823;
    name = "Etherlink Shadownet"
    rpc = "https://node.shadownet.etherlink.com";
    blockExplorers = [{
        name: "Etherlink Shadownet Explorer",
        url: "https://shadownet.explorer.etherlink.com/"
    }]
    faucets = ['https://shadownet.faucet.etherlink.com/']
}

let icon = <img src='/public/EtherlinkLogo.png' alt='Etherlink Logo' />
let nativeCurrency = {
    name: "Tez",
    symbol: "XTZ",
    decimals: 18,
}

export const chain = defineChain({
    name: name,
    id: id,
    rpc: rpc,
    icon: icon,
    nativeCurrency: nativeCurrency,
    blockExplorers: blockExplorers,
    testnet: true,
    faucets: faucets
});
