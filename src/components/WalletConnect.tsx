import { Web3Button, Web3Modal } from '@web3modal/react'
import { Box, Button, Text } from 'grommet'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { ethereumClient } from '../utils'

export const WalletConnect = (props: { projectId: string }) => {
  const { isConnected, address } = useAccount()
  const [txHash, setTxHash] = useState('')

  const onSendClicked = async () => {
    try {
      const web3 = new Web3('https://api.harmony.one')
      const amount = web3.utils.toWei('10', 'ether');
      const transactionParameters = {
        nonce: '0x00',
        gas: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(1000 * 1000 * 1000 * 1000),
        to: '0x0000000000000000000000000000000000000000',
        from: address,
        value: web3.utils.toHex(amount),
        chainId: window.ethereum.networkVersion
      };
      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      setTxHash(hash)
    } catch (e) {
      console.log('Cannot send tx:', e)
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
                <Box width={'160px'}>
                    <Button primary onClick={onSendClicked}>
                        Pay (10 ONE)
                    </Button>
                </Box>
              {txHash &&
                <Box margin={{top: 'medium'}}>
                    <Text><a href={`https://explorer.harmony.one/tx/${txHash}`} target={'_blank'}>Check tx on Explorer</a></Text>
                </Box>
              }
            </Box>
        }
      </Box>
    </Box>
    <Web3Modal projectId={props.projectId} ethereumClient={ethereumClient} />
  </Box>
}
