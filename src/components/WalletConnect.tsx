import { Web3Button, Web3Modal } from '@web3modal/react'
import { Box, Button, Text } from 'grommet'
import React, { useState, useEffect } from 'react'
import QRCode from "react-qr-code";
import { useAccount, useConnect, useDisconnect, Connector } from 'wagmi'
import Web3 from 'web3'
import WalletConnect from "@walletconnect/browser";
import { ethereumClient } from '../utils'
import { ApplePay } from './ApplePay'
import {ReactComponent as MetamaskLogo} from '../assets/metamask-fox.svg';

const payAmountOne = 50
const receiverAddress = '0xac29041489210563f02f95ad85Df2e033131aE77'

const ConnectorNameMap: Record<string, string> = {
  Injected: 'Metamask',
  Metamask: 'Metamask',
  WalletConnect: 'QR Code'
}

const wcConnector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org",
});

const ConnectorItem = (props: any) => {
  const { isLoading, connector, pendingConnector, connect, walletConnectURI } = props
  const name = ConnectorNameMap[connector.name] || connector.name

  let content = <Button
    primary
    disabled={!connector.ready}
    key={connector.id}
    onClick={() => connect({ connector })}
  >
    {name}
    {!connector.ready && ' (unsupported)'}
    {isLoading &&
      connector.id === pendingConnector?.id &&
      ' (connecting)'}
  </Button>

  if(connector.id === 'injected') {
    content = <Box align={'center'} justify={'center'}>
      <MetamaskLogo onClick={() => connect({ connector })} style={{ cursor: 'pointer' }} />
    </Box>
  }
  else if (connector.id === 'walletConnect_qr' && walletConnectURI) {
    content = <Box align={'center'} justify={'center'}>
      <QRCode
        size={96}
        value={walletConnectURI}
      />
    </Box>
  }

  return <Box width={'120px'} gap={'16px'} margin={{ top: '16px' }}>
    <Box align={'center'}>
      {name}{!connector.ready && ' (unsupported)'}
    </Box>
    <Box>
      {content}
    </Box>
  </Box>
}

export const WalletConnecPage = (props: { projectId: string }) => {
  const { isConnected, address, connector } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const [walletConnectURI, setWalletConnectURI] = useState('')
  const [walletConnectAddress, setWalletConnectAddress] = useState('')
  const [isPageReady, setPageReady] = useState(false)
  const [isWcConnected, setWcConnected] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [txHash, setTxHash] = useState('')

  const createWalletConnectUri = async () => {
    try {
      if(wcConnector.session.key) {
        await wcConnector.killSession({ message: 'close session' })
      }
      await wcConnector.createSession()
      // console.log('Wallet connect uri:', wcConnector.uri)
      setWalletConnectURI(wcConnector.uri)
    } catch (e) {
      console.error('Cannot create Wallet connect URI', (e as Error).message)
    }
  }

  const onWalletConnectEvent = (error: any, payload: any) => {
    const { accounts, chainId } = payload.params[0];

    if(accounts.length > 0) {
      setWalletConnectAddress(accounts[0])
      console.log('Set wallet connect success: ', accounts[0])
    }
    setWcConnected(true)
  }

  const onWalletDisconnect = () => {
    setWcConnected(false)
  }

  useEffect(() => {
    createWalletConnectUri()
    setTimeout(() => setPageReady(true), 1000)
    wcConnector.on("connect", onWalletConnectEvent.bind(this));
    wcConnector.on("disconnect", onWalletDisconnect.bind(this));
  }, [])

  useEffect(() => {
    // Don't show transaction popup on page load, only on connect provider
    if(isConnected && isPageReady) {
      // setTimeout(() => { // timeout for QR code connector
      //   sendTransaction()
      // }, 200)
    }
    if(!isConnected) {
      setTxHash('')
    }
  }, [isConnected])

  const sendTxHandler = () => {
    if(isWcConnected) {
      sendWalletConnectTransaction()
    } else {
      sendTransaction()
    }
  }

  const sendTransaction = async () => {
    try {
      const provider = await connector!.getProvider()
      const web3 = new Web3(provider)
      const amount = web3.utils.toWei(payAmountOne.toString(), 'ether');
      const transactionParameters = {
        gas: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(1000 * 1000 * 1000 * 1000),
        to: receiverAddress,
        from: address,
        value: web3.utils.toHex(amount),
      };
      setIsConfirming(true)
      const tx = await web3.eth.sendTransaction(transactionParameters)
      setTxHash(tx.transactionHash)
    } catch (e) {
      console.log('Cannot send tx:', e)
    } finally {
      setIsConfirming(false)
    }
  }

  const sendWalletConnectTransaction = async () => {
    try {
      const web3 = new Web3('https://api.harmony.one')
      const amount = web3.utils.toWei(payAmountOne.toString(), 'ether');
      const transactionParameters = {
        to: receiverAddress,
        from: walletConnectAddress,
        data: "0x",
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(1000 * 1000 * 1000 * 1000),
        value: web3.utils.toHex(amount),
      };
      setIsConfirming(true)
      const tx = await wcConnector.sendTransaction(transactionParameters)
      console.log('tx:', tx)
      setTxHash(tx.transactionHash)
    } catch (e) {
      console.log('Cannot send tx:', e)
    } finally {
      setIsConfirming(false)
    }
  }

  return <Box>
    <Box direction={'row'} gap={'8px'}>
      <Box>
          <Box>
              <Box direction={'row'} gap={'32px'} wrap={true}>
                {window.location.href.includes('https://') &&
                    <Box gap={'16px'}>
                        <Box align={'center'}>
                          {/*@ts-ignore*/}
                          {typeof window.safari !== 'undefined' ? 'Apple pay' : 'Google Pay'}
                        </Box>
                        <Box margin={{ top: '16px' }}>
                            <ApplePay />
                        </Box>
                    </Box>
                }
                {connectors
                  .filter(connector => !['walletConnect'].includes(connector.id))
                  .map((connector, index) => {
                  const itemsProps = {
                    isLoading,
                    connector,
                    pendingConnector,
                    connect,
                    walletConnectURI,
                  }
                  return <ConnectorItem key={connector.id + index} {...itemsProps} />
                })}
                <Box gap={'16px'} margin={{ top: '16px' }}>
                    <Box align={'center'}>
                        Connect Wallet
                    </Box>
                    <Box>
                        <Web3Button label="Connect Wallet" />
                    </Box>
                </Box>
              </Box>
          </Box>
      </Box>
    </Box>
    {(isConnected || isWcConnected) && <Box gap={'32px'} margin={{ top: '32px' }}>
        <Box width={'200px'}>
            <Button primary disabled={isConfirming} onClick={sendTxHandler}>
              {isConfirming ? 'Confirming tx...' : `Pay (${payAmountOne} ONE)`}
            </Button>
        </Box>
        {txHash &&
            <Box>
                <Text><a href={`https://explorer.harmony.one/tx/${txHash}`} target={'_blank'}>Show transaction in Explorer</a></Text>
            </Box>
        }
    </Box>}
    {(isConnected || isWcConnected) &&
        <Box margin={{ top: '32px' }}>
            <Text onClick={async () => {
              disconnect()
              if(isWcConnected) {
                await wcConnector.killSession({ message: 'close session' })
              }
            }} style={{ textDecoration: 'underline', color: 'lightgrey', cursor: 'pointer' }}>Disconnect</Text>
        </Box>
    }
    <Web3Modal projectId={props.projectId} ethereumClient={ethereumClient} />
  </Box>
}
