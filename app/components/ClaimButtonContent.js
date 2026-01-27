import Image from "next/image";

export const ClaimButtonContent = ({ isLoading, txHash, rateLimited, waitHours }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Image
                    src="/img/home/logo.png"
                    alt="Loading..."
                    width={32}
                    height={32}
                    className={`w-8 mr-2 ${isLoading ? 'spin-logo' : ''}`}
                />
            </div>
        );
    }

    if (txHash) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Image
                    src="/img/home/logo.png"
                    alt="logo"
                    width={32}
                    height={32}
                    className="w-8 mr-2"
                />
                <span className="truncate">{`${txHash.slice(0, 6)}`}</span>
            </div>
        );
    }

    if (rateLimited) {
        return `Wait ${waitHours}h`;
    }

    return "Send";
};
