import React, { useState } from 'react'
import {Box, Button, Select, Image} from "grommet";
import {Description} from "../components/Description";
import config from '../config'
import { observer } from 'mobx-react';
import { useStores } from '../hooks/useStores';

const ImageItem = (props: { name: string }) => {
    return <Box
        background={`url('${props.name}')`}
        height="350px"
        width="350px"
    />
}

const ListItem = (props: { name: string, isLocked: boolean }) => {
    const { isLocked, name } = props

    const style = isLocked
        ? { filter: 'grayscale(100%)' }
        : {}

    return <Box
        border={{ color: "brand", size: "1px" }}
        margin={{ bottom: '32px' }}
        style={style}
    >
        <ImageItem name={name} />
    </Box>
}

export const Root = observer(() => {
    const { accountStore } = useStores()
    const [paymentMode, setPaymentMode] = useState<'payment' | 'subscription'>('payment')

    const checkoutLink = `${config.apiUrl}/stripe/checkout?mode=${paymentMode}`
    const onSubscribeClicked = () => window.open(checkoutLink, '_self')

    const onUnsubscribeClicked = () => {
        accountStore.setIsSubscribed(false)
    }

    const isLocked = !accountStore.isSubscribed

    const listItemProps = {
        isLocked,
        onSubscribeClicked
    }

    return <Box gap={'32px'}>
        <Box direction={'row'} align={'center'} gap={'32px'}>
            {/*<Select*/}
            {/*    options={['payment', 'subscription']}*/}
            {/*    value={paymentMode}*/}
            {/*    onChange={({ option }) => setPaymentMode(option)}*/}
            {/*/>*/}
            {accountStore.isSubscribed &&
                <Button primary size={'large'} onClick={onUnsubscribeClicked}>
                    Unsubscribe
                </Button>
            }
            {!accountStore.isSubscribed &&
                <Button primary size={'large'} onClick={onSubscribeClicked}>
                    Subscribe to unlock content
                </Button>
            }
        </Box>
        <Box direction={'row'} gap={'32px'} wrap>
            <ListItem {...listItemProps} name={'image1.jpeg'} />
            <ListItem {...listItemProps} name={'image2.jpeg'} />
            <ListItem {...listItemProps} name={'image3.jpeg'} />
            <ListItem {...listItemProps} name={'image4.jpeg'} />
            <ListItem {...listItemProps} name={'image5.jpeg'} />
        </Box>
    </Box>
})
