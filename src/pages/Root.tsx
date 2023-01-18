import React from 'react'
import {Box} from "grommet";
import config from '../config'
import { ApplePay } from '../components/ApplePay';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const Root = () => {
    const stripePromise = loadStripe(config.stripe.pkKey)

    return <Box>
        <Elements stripe={stripePromise}>
            <ApplePay />
        </Elements>
    </Box>
}
