import React from 'react'
import {Box, Button} from "grommet";
import {Description} from "../components/Description";
import config from '../config'

export const Root = () => {
    const checkoutLink = `${config.apiUrl}/stripe/checkout`
    const onSubscribeClicked = () => window.open(checkoutLink)

    return <Box>
        <Box direction={'row'} align={'center'} gap={'32px'}>
            <Button primary size={'large'} onClick={onSubscribeClicked}>
                Subscribe
            </Button>
            <Description text={`Opens "${checkoutLink}". Backend will generate Stripe link and user will be redirected to Stripe payment page.`} />
        </Box>
    </Box>
}
