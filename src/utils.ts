import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
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

// const wcQr = new WalletConnectConnector({
//     chains,
//     options: {
//       qrcode: true,
//     },
//   })
// // @ts-ignore
// wcQr.id = 'walletConnect_qr' // Hack to fix two conflicting Wallet Connect instances: old and new-style

const connectors = [
  // new MetaMaskConnector({ chains }),
  // wcQr,
  ...web3ModalConnectors
    .filter((connector) => ['walletConnect', 'injected'].includes(connector.id))
]

export const wagmiClient = createClient({
  autoConnect: true,
  // connectors: web3ModalConnectors,
  connectors,
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
