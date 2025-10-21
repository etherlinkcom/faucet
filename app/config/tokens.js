const testnetTokens = [
    { name: 'Tether USD', symbol: 'USDT', amount: '50', address: '0xf7f007dc8Cb507e25e8b7dbDa600c07FdCF9A75B', decimals: 6, logo: '/img/tokens/USDT.png' },
    { name: 'USD Coin', symbol: 'USDC', amount: '50', address: '0x4C2AA252BEe766D3399850569713b55178934849', decimals: 6, logo: '/img/tokens/USDC.png' },
    { name: 'Wrapped Eth', symbol: 'WETH', amount: '0.1', address: '0x86932ff467A7e055d679F7578A0A4F96Be287861', decimals: 18, logo: '/img/tokens/WETH.png' },
];

const shadownetTokens = []

const networkTokens = process.env.NEXT_PUBLIC_NETWORK === "shadownet" ? shadownetTokens : testnetTokens;

export const tokens = [
    { name: 'Tezos', symbol: 'XTZ', amount: '0.15', address: '', decimals: 18, logo: '/img/tokens/XTZ.svg' },
    ...networkTokens
]