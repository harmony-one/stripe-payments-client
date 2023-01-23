import { Web3Button, Web3Modal } from '@web3modal/react'
import { Box, Button, Text } from 'grommet'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { ethereumClient } from '../utils'

export const WalletConnect = (props: { projectId: string }) => {
  const { isConnected, address, connector } = useAccount()
  const [isConfirming, setIsConfirming] = useState(false)
  const [txHash, setTxHash] = useState('')

  const onSendClicked = async () => {
    try {
      const provider = await connector!.getProvider()
      const web3 = new Web3(provider)
      const amount = web3.utils.toWei('10', 'ether');
      const transactionParameters = {
        gas: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(1000 * 1000 * 1000 * 1000),
        to: '0x95D02e967Dd2D2B1839347e0B84E59136b11A073',
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
      {!isConnected &&
          <Box>
              <Web3Button label="Connect Wallet" />
          </Box>
      }
      <Box>
        {(isConnected && address) &&
            <Box>
                <Box width={'280px'}>
                    <Button primary disabled={isConfirming} onClick={onSendClicked}>
                      {isConfirming ? 'Confirming transaction...' : 'Subscribe (10 ONE)'}
                    </Button>
                </Box>
              {txHash &&
                <Box margin={{top: 'medium'}}>
                    <Text><a href={`https://explorer.harmony.one/tx/${txHash}`} target={'_blank'}>Show tx on Explorer</a></Text>
                </Box>
              }
            </Box>
        }
      </Box>
    </Box>
    <Web3Modal projectId={props.projectId} ethereumClient={ethereumClient} />
  </Box>
}
