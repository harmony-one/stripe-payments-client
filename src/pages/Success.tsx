import React, { useEffect } from 'react'
import {Box, Button, Text} from "grommet";
import {Description} from "../components/Description";
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '../hooks/useStores';

export const Success = observer(() => {
    const { accountStore } = useStores()

    useEffect(() => {
        accountStore.setIsSubscribed(true)
    }, [])

    return <Box>
        <Box direction={'row'} align={'center'} gap={'32px'}>
            <Text color={'green'}>Payment status: success. Now you have access to app content.</Text>
        </Box>
        <Box direction={'row'} align={'center'} gap={'32px'} margin={{ top: '32px' }}>
                <Link to={'/'}>
                    <Button primary size={'large'}>
                        Back to main page
                    </Button>
                </Link>
        </Box>
    </Box>
})
