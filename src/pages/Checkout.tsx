import React, { useEffect, useState } from 'react'
import {Box, Button} from "grommet";
import { loadStripe   } from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js';
import config from '../config'
import { createPaymentIntent } from '../api';
import CheckoutForm from '../components/CheckoutForm';
export const Checkout = () => {
    const [clientSecret, setClientSecret] = useState('')

    useEffect(() => {
        const getClientSecret = async () => {
            try {
                const data = await createPaymentIntent()
                setClientSecret(data)
            } catch (e) {
                console.error('Cannot get client secret', e)
            }
        }
        getClientSecret()
    }, [])

    const { apiVersion, pkKey } = config.stripe
    console.log('pkKey', pkKey)
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
        <Box>
            Checkout with Stripe form
        </Box>
        {clientSecret &&
            <Box>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            </Box>
        }
    </Box>
}
