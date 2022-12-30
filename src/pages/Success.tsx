import React from 'react'
import {Box, Text} from "grommet";
import {Description} from "../components/Description";

export const Success = () => {
    return <Box>
        <Box direction={'row'} align={'center'} gap={'32px'}>
            <Text color={'green'}>Payment status: Success</Text>
            <Description text={`Payment was successful. Backend will receive Stripe webhook event and send transactions to 1.country contract.`} />
        </Box>
    </Box>
}
