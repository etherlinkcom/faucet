export const NAVBAR_ITEMS = [
  {
    dropdown: false,
    title: "Ecosystem",
    link: "https://etherlink.com/ecosystem",
  },
  {
    dropdown: false,
    title: "Docs",
    link: "https://docs.etherlink.com/",
  },
  {
    dropdown: true,
    title: "Resources",
    items: [
      {
        name: "Faucet",
        link: "/",
      },
      {
        name: "Explorer",
        link: "https://testnet-explorer.etherlink.com/",
      },
      {
        name: "Blog",
        link: "https://medium.com/@etherlink",
      },
      {
        name: "Using your wallet",
        link: "https://docs.etherlink.com/get-started/using-your-wallet/",
      },
    ],
  },
];
