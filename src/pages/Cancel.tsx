import React from 'react'
import {Box, Text} from "grommet";
import {Description} from "../components/Description";
import config from "../config";

export const Cancel = () => {
    return <Box>
        <Box direction={'row'} align={'center'} gap={'32px'}>
            <Text color={'red'}>Payment status: Cancelled</Text>
            <Description text={`Payment was cancelled`} />
        </Box>
    </Box>
}
