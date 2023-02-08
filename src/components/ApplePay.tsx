import React, { useEffect, useState } from 'react'
import { Box, Button } from 'grommet'
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { createPaymentIntent } from '../api';
import StatusMessages, { useMessages } from './StatusMessages';
import styled from 'styled-components';

const ApplePayButton = styled(Button)`
    border-radius: 4px;
    background-color: black;
    color: white;
    font-size: 19px;
    padding: 10px 48px;
`

export const ApplePay = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [messages, addMessage] = useMessages();
    const [paymentRequest, setPaymentRequest] = useState<any>(null)
    const [canMakePayment, setCanMakePayment] = useState<any>(null)

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
            setCanMakePayment(result)
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

    const options = {
        paymentRequest,
        classes: {
            base: 'test-stripe-base'
        }
    }

    const onCustomButtonClick = () => {
        paymentRequest.show()
    }

    let buttonContent = canMakePayment ? <PaymentRequestButtonElement options={options} /> : null
    if(canMakePayment && canMakePayment.applePay) {
        buttonContent = <ApplePayButton onClick={onCustomButtonClick}>
            
        </ApplePayButton>
    }

    return <Box width={'120px'}>
        {buttonContent}
    </Box>
}
