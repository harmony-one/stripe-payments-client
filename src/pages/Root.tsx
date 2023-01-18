import React, { useState } from 'react'
import {Box, Button, Select} from "grommet";
import {Description} from "../components/Description";
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
