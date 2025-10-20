const addTokenToWallet = async (token) => {
    try {
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    image: token.image,
                },
            },
        });
    } catch (error) {
        console.log(error);
    }
}

export const AddTokenToWalletButton = ({ token }) => {
    return (
           token.address !== '' && <button
                onClick={() => addTokenToWallet(token)}
                className={`
            flex flex-row items-center justify-center
            text-sm font-medium text-center text-black
            bg-zinc-200 border-solid border-2 border-black rounded-md
            px-2 py-1 hover:bg-darkGreen hover:border-black
            hover:text-white
            `}
            >
                Add to Wallet
            </button>
    );
};