import React, { useEffect, useState } from 'react'
import { Box } from 'grommet'
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { createPaymentIntent } from '../api';
import StatusMessages, { useMessages } from './StatusMessages';

export const ApplePay = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [messages, addMessage] = useMessages();
    const [paymentRequest, setPaymentRequest] = useState<any>(null)

    useEffect(() => {
        if(!stripe || !elements) {
            return
        }

        const pr = stripe.paymentRequest({
            currency: 'usd',
            country: 'US',
            requestPayerEmail: true,
            requestPayerName: true,
            total: {
                label: 'Demo payment',
                amount: 100
            }
        })

        pr.canMakePayment().then((result) => {
            console.log('canMakePayment:', result)
            setPaymentRequest(pr)
        })

        pr.on('paymentmethod', async (e) => {
            let clientSecret = ''
            try {
                clientSecret = await createPaymentIntent('card', 'usd')
            } catch (e) {
                addMessage((e as Error).message);
                return
            }

            const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: e.paymentMethod.id
            }, {
                handleActions: false, // Handle next actions in the flow, like 3d-secure
            })

            if(stripeError) {
                addMessage(stripeError.message as string);
                e.complete('fail');
                return;
            }

            e.complete('success')

            if(paymentIntent.status === 'requires_action') {
                stripe.confirmCardPayment(clientSecret)
            }
            addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
        })
    }, [stripe, elements, addMessage])

    if(!paymentRequest) {
        return null
    }

    return <Box width={'120px'}>
        <PaymentRequestButtonElement options={{ paymentRequest }} />
    </Box>
}
