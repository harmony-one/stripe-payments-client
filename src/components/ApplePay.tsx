import React, { useEffect, useState } from 'react'
import { Box, Button } from 'grommet'
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { createPaymentIntent } from '../api';
import styled from 'styled-components';
import {ReactComponent as GooglePayLogo} from '../assets/google_pay.svg';
import {ReactComponent as LinkLogo} from '../assets/link.svg';

const ApplePayButton = styled(Button)`
    display: flex;
    justify-content: center;
    width: 120px;
    border-radius: 4px;
    background-color: black;
    text-align: center;
    color: white;
    font-size: 19px;
    padding: 10px 48px;
    text-align: center;
`

const GooglePayButton = styled(Button)`
    width: 120px;
    display: flex;
    text-align: center;
    border-radius: 100vh;
    background-color: black;
    color: white;
    padding: 10px 32px;
    text-align: center;
`

const LinkButton = styled(Button)`
    width: 120px;
    height: 40px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-content: center;
    border-radius: 6px;
    background-color: #009788;
    color: white;
    padding: 10px 32px;
    text-align: center;
    
    svg {
        padding-top: 2px;
    }
`

export const ApplePay = () => {
    const stripe = useStripe()
    const elements = useElements()
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
            console.log('Stripe canMakePayment:', result)
            setCanMakePayment(result)
            setPaymentRequest(pr)
        })

        pr.on('paymentmethod', async (e) => {
            let clientSecret = ''
            try {
                clientSecret = await createPaymentIntent('card', 'usd')
            } catch (e) {
                return
            }

            const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: e.paymentMethod.id
            }, {
                handleActions: false, // Handle next actions in the flow, like 3d-secure
            })

            if(stripeError) {
                e.complete('fail');
                return;
            }

            e.complete('success')

            if(paymentIntent.status === 'requires_action') {
                stripe.confirmCardPayment(clientSecret)
            }
        })
    }, [stripe, elements])

    if(!paymentRequest) {
        return null
    }

    const onCustomButtonClick = () => {
        paymentRequest.show()
    }

    let buttonContent = <ApplePayButton disabled>N/A</ApplePayButton>
    if(canMakePayment) {
        const { applePay, googlePay, link } = canMakePayment
        if(applePay) {
            buttonContent = <ApplePayButton onClick={onCustomButtonClick}></ApplePayButton>
        } else if(googlePay) {
            buttonContent = <GooglePayButton onClick={onCustomButtonClick}>
                <GooglePayLogo width={'48px'} />
            </GooglePayButton>
        } else if(link) {
            <LinkButton onClick={onCustomButtonClick}>
                <LinkLogo width={'32px'} />
            </LinkButton>
        }
        // else {
        //     buttonContent = <PaymentRequestButtonElement options={{ paymentRequest }} />
        // }
    }

    return <Box>
        {buttonContent}
    </Box>
}
