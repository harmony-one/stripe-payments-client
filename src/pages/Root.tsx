import React, { useState } from 'react'
import {Box, Button, Select} from "grommet";
import {Description} from "../components/Description";
import config from '../config'
import { Link } from 'react-router-dom';

export const Root = () => {
    const [paymentMode, setPaymentMode] = useState<'payment' | 'subscription'>('payment')

    const checkoutLink = `${config.apiUrl}/stripe/checkout?mode=${paymentMode}`
    const onSubscribeClicked = () => window.open(checkoutLink)

    return <Box gap={'32px'}>
        <Box direction={'row'} align={'center'} gap={'32px'}>
            <Select
                options={['payment', 'subscription']}
                value={paymentMode}
                onChange={({ option }) => setPaymentMode(option)}
            />
            <Button primary size={'large'} onClick={onSubscribeClicked}>
                Open checkout form
            </Button>
            <Description text={`Opens "${checkoutLink}". Backend will generate Stripe link and user will be redirected to Stripe payment page.`} />
        </Box>
        {/*<Box direction={'row'} align={'center'} gap={'32px'}>*/}
        {/*    <Link to={'/checkout'}>*/}
        {/*        <Button primary size={'large'}>*/}
        {/*            Pay here*/}
        {/*        </Button>*/}
        {/*    </Link>*/}
        {/*    <Description text={`Opens stripe payable form`} />*/}
        {/*</Box>*/}
    </Box>
}
