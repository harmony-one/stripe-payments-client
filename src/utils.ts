import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import config from './config'

const { walletConnect: { projectId }, chainParams } = config

const chains = [chainParams]
//const chains = [arbitrum, mainnet, polygon];
// Wagmi client
const { provider } = configureChains(chains, [
  // @ts-ignore
  walletConnectProvider({ projectId }),
]);

const web3ModalConnectors = modalConnectors({ appName: "web3Modal", chains })

const wc = new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  })
// @ts-ignore
// wc.id = 'walletConnect_qr' // Hack to fix conflicting Wallet Connect instances

const connectors = [
  new MetaMaskConnector({ chains }),
  wc,
  //...web3ModalConnectors
    //.filter((connector) => ['walletConnect', 'injected'].includes(connector.id))
]

export const wagmiClient = createClient({
  autoConnect: true,
  // connectors: web3ModalConnectors,
  connectors,
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
