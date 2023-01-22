import { Web3Button, Web3Modal } from '@web3modal/react'
import { Box, Button } from 'grommet'
import React from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { ethereumClient } from '../utils'

export const WalletConnect = (props: { projectId: string }) => {
  const { isConnected, address, connector } = useAccount()
  console.log('connector', connector)

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
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log('Tx hash:', txHash)
    } catch (e) {
      console.log('Cannot send tx:', e)
    }
  }

  return <Box>
    <Box direction={'row'} gap={'8px'}>
      <Box>
        <Web3Button label="Connect Wallet" />
      </Box>
      <Box>
        {(isConnected && address) &&
            <Box>
                <Button primary onClick={onSendClicked}>
                    Send 10 ONE
                </Button>
            </Box>
        }
      </Box>
    </Box>
    <Web3Modal projectId={props.projectId} ethereumClient={ethereumClient} />
  </Box>
}
