"use client"

import { useEffect, useState } from "react"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES } from "@web3auth/base"
import Web3 from "web3"

const clientId =
    "BBSaZM24AvsqUvo6U01acSBnKjeqnQheLZDPMu3yGGtbdcpb5hVAU4TsQm-75X1FtwXh1H9thpkuSWpYaToWu_s";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1F47B", // Please use 0x1 for Mainnet
    rpcTarget: "https://node.ghostnet.etherlink.com",
    displayName: "Etherlink Testnet",
    blockExplorer: "https://explorer.etherlink.com/",
    ticker: "XTZ",
    tickerName: "Tezos",
};

const web3auth = new Web3Auth({
    clientId,
    chainConfig,
    web3AuthNetwork: "sapphire_devnet",
});

export default function Auth() {
    const [provider, setProvider] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal()
                setProvider(web3auth.provider)

                if (web3auth.connected) {
                    setLoggedIn(true)
                }
            } catch (error) {
                console.error(error)
            }
        }

        init()
    }, [])

    const login = async () => {
        const web3authProvider = await web3auth.connect()
        setProvider(web3authProvider)
        if (web3auth.connected) {
            setLoggedIn(true)
        }
    }

    const getUserInfo = async () => {
        const user = await web3auth.getUserInfo()
        uiConsole(user)
    }

    const logout = async () => {
        await web3auth.logout()
        setProvider(null)
        setLoggedIn(false)
        uiConsole("logged out")
    }

    const getAccounts = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet")
            return
        }
        const web3 = new Web3(provider)

        // Get user's Ethereum public address
        const address = await web3.eth.getAccounts()
        uiConsole(address)
    }

    const getBalance = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet")
            return
        }
        const web3 = new Web3(provider)

        // Get user's Ethereum public address
        const address = (await web3.eth.getAccounts())[0]
        console.log("address: " + address);

        // Get user's balance in ether
        const balance = web3.utils.fromWei(
            // Balance is in wei
            await web3.eth.getBalance(address),
            "ether"
        )
        uiConsole(balance)
    }

    const signMessage = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet")
            return
        }
        const web3 = new Web3(provider)

        // Get user's Ethereum public address
        const fromAddress = (await web3.eth.getAccounts())[0]

        const originalMessage = "YOUR_MESSAGE"

        // Sign the message
        const signedMessage = await web3.eth.personal.sign(
            originalMessage,
            fromAddress, // configure your own password here.
            "test password!"
        )
        uiConsole(signedMessage)
    }

    function uiConsole(...args) {
        const el = document.querySelector("#console>p")
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2)
            console.log(...args)
        }
    }

    const loggedInView = (
        <>
            <div className="flex-container">
                <div>
                    <button onClick={getUserInfo} className="card">
                        Get User Info
                    </button>
                </div>
                <div>
                    <button onClick={getAccounts} className="card">
                        Get Accounts
                    </button>
                </div>
                <div>
                    <button onClick={getBalance} className="card">
                        Get Balance
                    </button>
                </div>
                <div>
                    <button onClick={signMessage} className="card">
                        Sign Message
                    </button>
                </div>
                <div>
                    <button onClick={logout} className="card">
                        Log Out
                    </button>
                </div>
            </div>
        </>
    )

    const unloggedInView = (
        <button onClick={login} className="card">
            Login
        </button>
    )

    return (
        <div className="container">
            <h1 className="title">
                <a
                    target="_blank"
                    href="https://web3auth.io/docs/sdk/pnp/web/modal"
                    rel="noreferrer"
                >
                    Web3Auth{" "}
                </a>
                & NextJS Quick Start
            </h1>

            <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
            <div id="console" style={{ whiteSpace: "pre-line" }}>
                <p style={{ whiteSpace: "pre-line" }}></p>
            </div>

            <footer className="footer">
                <a
                    href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/nextjs-modal-quick-start"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Source code
                </a>
            </footer>
        </div>
    )
}

