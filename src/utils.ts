import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
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

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: web3ModalConnectors,
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
