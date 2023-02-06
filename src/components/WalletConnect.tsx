import { Web3Button, Web3Modal } from '@web3modal/react'
import { Box, Button, Text } from 'grommet'
import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, Connector } from 'wagmi'
import Web3 from 'web3'
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

const ConnectorItem = (props: any) => {
  const { isLoading, connector, pendingConnector, connect } = props
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

  return <Box gap={'16px'}>
    <Box align={'center'}>
      {name}
    </Box>
    <Box>
      {content}
    </Box>
  </Box>
}

export const WalletConnect = (props: { projectId: string }) => {
  const { isConnected, address, connector } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const [isConfirming, setIsConfirming] = useState(false)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    if(connector && isConnected) {
      console.log('Wallet connected:', connector.id)
      sendTransaction()
    }
    if(!isConnected) {
      setTxHash('')
    }
  }, [connector, isConnected])

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

  return <Box>
    <Box direction={'row'} gap={'8px'}>
      <Box>
          <Box>
              <Box direction={'row'} gap={'32px'}>
                {window.location.href.includes('https://') &&
                    <Box gap={'16px'}>
                        <Box align={'center'}>
                          {/*@ts-ignore*/}
                          {typeof window.safari !== 'undefined' ? 'Apple pay' : 'Google Pay'}
                        </Box>
                        <Box>
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
                    connect
                  }
                  return <ConnectorItem key={connector.id + index} {...itemsProps} />
                })}
                <Box gap={'16px'}>
                    <Box align={'center'}>
                        Connect Wallet
                    </Box>
                    <Box>
                        <Web3Button label="Connect Wallet" />
                    </Box>
                </Box>
                {/*{isConnected &&*/}
                {/*    <Box margin={{ left: '64px' }}>*/}
                {/*        <Text onClick={() => disconnect()} style={{ textDecoration: 'underline', color: 'gray', cursor: 'pointer' }}>Disconnect</Text>*/}
                {/*    </Box>*/}
                {/*}*/}
              </Box>
          </Box>
      </Box>
    </Box>
    {isConnected && <Box gap={'32px'} margin={{ top: '32px' }}>
        <Box width={'200px'}>
            <Button primary disabled={isConfirming} onClick={sendTransaction}>
              {isConfirming ? 'Confirming tx...' : `Pay (${payAmountOne} ONE)`}
            </Button>
        </Box>
        {txHash &&
            <Box>
                <Text><a href={`https://explorer.harmony.one/tx/${txHash}`} target={'_blank'}>Show transaction in Explorer</a></Text>
            </Box>
        }
    </Box>}
    <Web3Modal projectId={props.projectId} ethereumClient={ethereumClient} />
  </Box>
}
