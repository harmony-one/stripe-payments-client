import React from 'react'
import {Box} from "grommet";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from '../config'
import { ApplePay } from '../components/ApplePay';
import { WalletConnecPage } from '../components/WalletConnect';

const { walletConnect, stripe } = config

export const Root = () => {
    const stripePromise = loadStripe(stripe.pkKey)

    return <Box>
        <Elements stripe={stripePromise}>
            <Box direction={'column'} gap={'32px'}>
                <WalletConnecPage projectId={walletConnect.projectId} />
            </Box>
        </Elements>
    </Box>
}
