import React, { useEffect, useState } from 'react'
import {Box} from "grommet";
import { loadStripe } from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js';
import config from '../config'
import { createPaymentIntent } from '../api';
import CheckoutForm from '../components/CheckoutForm';

export const StripeCheckout = () => {
    const [clientSecret, setClientSecret] = useState('')

    useEffect(() => {
        const getClientSecret = async () => {
            try {
                const data = await createPaymentIntent()
                console.log('Payment intent loaded:', data)
                setClientSecret(data)
            } catch (e) {
                console.error('Cannot get client secret', e)
            }
        }
        getClientSecret()
    }, [])

    const { apiVersion, pkKey } = config.stripe
    const stripePromise = loadStripe(pkKey, { apiVersion })

    if(!clientSecret) {
        return null
    }

    const options: any = {
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    };

    return <Box>
        {clientSecret &&
            <Box>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            </Box>
        }
    </Box>
}
