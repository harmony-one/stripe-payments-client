import { Web3Button, Web3Modal } from '@web3modal/react'
import { Box, Button, Text } from 'grommet'
import React, { useState, useEffect } from 'react'
import QRCode from "react-qr-code";
import { useAccount, useConnect, useDisconnect, Connector } from 'wagmi'
import Web3 from 'web3'
import { Select, Space } from 'antd';
import WalletConnect from "@walletconnect/browser";
import { ethereumClient } from '../utils'
import { ApplePay } from './ApplePay'
import {ReactComponent as MetamaskLogo} from '../assets/metamask-fox.svg';
import styled from 'styled-components';

const payAmountOne = 50
const receiverAddress = '0xac29041489210563f02f95ad85Df2e033131aE77'

const qrConnector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org",
});

// @ts-ignore
const isSafari = typeof window.safari !== 'undefined' || !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

enum PaymentMethod {
  pay = 'pay',
  qr = 'qr',
  walletConnect = 'walletConnect'
}

const SpaceWrapper = styled(Box)`
  padding: 16px;
  border: 1px solid rgba(5, 5, 5, 0.06);
  border-radius: 16px;
`

export const ConnectorsDemoPage = (props: { projectId: string }) => {
  const { isConnected, address, connector } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const [walletConnectURI, setWalletConnectURI] = useState('')
  const [walletConnectAddress, setWalletConnectAddress] = useState('')
  const [isPageReady, setPageReady] = useState(false)
  const [isQrConnected, setQrConnected] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>()

  const createWalletConnectUri = async () => {
    try {
      if(qrConnector.session.key) {
        await qrConnector.killSession({ message: 'close session' })
      }
      await qrConnector.createSession()
      // console.log('Wallet connect uri:', qrConnector.uri)
      setWalletConnectURI(qrConnector.uri)
    } catch (e) {
      console.error('Cannot create Wallet connect URI', (e as Error).message)
    }
  }

  const onQrWalletConnectEvent = (error: any, payload: any) => {
    const { accounts, chainId } = payload.params[0];

    if(accounts.length > 0) {
      setWalletConnectAddress(accounts[0])
      console.log('Set wallet connect success: ', accounts[0])
    }
    setQrConnected(true)
  }

  const onQrWalletDisconnect = () => {
    setQrConnected(false)
  }

  useEffect(() => {
    createWalletConnectUri()
    setTimeout(() => setPageReady(true), 1000)
    qrConnector.on("connect", onQrWalletConnectEvent.bind(this));
    qrConnector.on("disconnect", onQrWalletDisconnect.bind(this));
  }, [])

  useEffect(() => {
    // Don't show transaction popup on page load, only on connect provider
    if(isPageReady) {
      setTimeout(() => {
        sendTxHandler()
      }, 200)
    }
    if(!isConnected) {
      setTxHash('')
    }
  }, [isConnected, isQrConnected])

  const sendTxHandler = () => {
    if(isQrConnected) {
      sendWalletConnectTransaction()
    } else if(isConnected) {
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
      const tx = await qrConnector.sendTransaction(transactionParameters)
      console.log('tx:', tx)
      setTxHash(tx.transactionHash)
    } catch (e) {
      console.log('Cannot send tx:', e)
    } finally {
      setIsConfirming(false)
    }
  }

  const ApplePayElement = isSafari ? <Box gap={'8px'} margin={{ bottom: '32px' }}>
    <Box align={'center'}>
      {(isSafari) ? 'Apple Pay' : 'Google Pay'}
    </Box>
    <Box>
      <ApplePay />
    </Box>
  </Box> : null

  const ConnectWalletElement = <Box gap={'8px'} margin={{ bottom: '32px' }}>
    <Box align={'center'}>
      Connect Wallet
    </Box>
    <Box>
      <Web3Button label="Connect Wallet" />
    </Box>
  </Box>

  const QrCodeElement = <Box gap={'8px'} margin={{ bottom: '32px' }}>
    <Box align={'center'}>
      QR Code
    </Box>
    <Box align={'center'} justify={'center'}>
      <QRCode
        size={96}
        value={walletConnectURI}
      />
    </Box>
  </Box>

  return <Box>
    <SpaceWrapper>
      <Box direction={'row'} gap={'8px'}>
        <Box>
          <Box>
            <Box direction={'row'} gap={'48px'} wrap={true}>
              {window.location.href.includes('https://') &&
                ApplePayElement
              }
              {ConnectWalletElement}
              {QrCodeElement}
            </Box>
          </Box>
        </Box>
      </Box>
      {(isConnected || isQrConnected) && <Box gap={'32px'} margin={{ top: '64px' }}>
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
      {(isConnected || isQrConnected) &&
          <Box margin={{ top: '32px' }}>
              <Text onClick={async () => {
                disconnect()
                if(isQrConnected) {
                  await qrConnector.killSession({ message: 'close session' })
                }
              }} style={{ textDecoration: 'underline', color: 'lightgrey', cursor: 'pointer' }}>Disconnect</Text>
          </Box>
      }
    </SpaceWrapper>
    <SpaceWrapper margin={{ top: '32px' }}>
      <Box>
        <Select
          placeholder={'Select payment option'}
          style={{ width: '220px' }}
          options={[
            { value: PaymentMethod.pay, label: isSafari ? 'Apple Pay' : 'Google Pay' },
            { value: PaymentMethod.qr, label: 'QR Code' },
            { value: PaymentMethod.walletConnect, label: 'Connect Wallet' },
          ]}
          onChange={(value: PaymentMethod) => setSelectedMethod(value)}
        />
      </Box>
      <Box width={'180px'} margin={{ top: '32px' }}>
        {selectedMethod === PaymentMethod.pay &&
          ApplePayElement
        }
        {selectedMethod === PaymentMethod.qr &&
          QrCodeElement
        }
        {selectedMethod === PaymentMethod.walletConnect &&
          ConnectWalletElement
        }
      </Box>
    </SpaceWrapper>
    <Web3Modal projectId={props.projectId} ethereumClient={ethereumClient} />
  </Box>
}
