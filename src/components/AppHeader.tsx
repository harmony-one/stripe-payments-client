import React, {useEffect, useState} from 'react'
import Icon, {HarmonyIcon} from "./Icon";
import {useStores} from "../hooks/useStores";
import {Box, Button, DropButton, Text} from "grommet";
import {observer} from "mobx-react";
import {breakpoints} from "../utils";
import {useLocation, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {UserAccount} from "./UserAccount";

const HeaderContainer = styled(Box)`
  box-shadow: rgb(4 17 29 / 25%) 0 0 8px 0;
  z-index: 100;
`

const AppHeader = observer(() => {
    let navigate = useNavigate();
    const { accountStore } = useStores()

    return <HeaderContainer
        tag='header'
        align='center'
        height={'66px'}
        pad={'20px 0 12px 0'}
        border={{ side: 'bottom', color: 'border', size: '1px' }}
        background={'background'}
        style={{ position: 'sticky', top: '0px' }}
    >
        <Box
            direction={'row'}
            gap={'16px'}
            // pad={'0 24px 0 24px'}
            align='center'
            justify='between'
            width={{ width: '100%', max: breakpoints.desktop }}
        >
            <Box
                direction={'row'}
                gap={'28px'}
                justify={'center'}
                align={'center'}
                onClick={() => navigate("/")}
            >
                <Box>
                    <HarmonyIcon width={'30px'} />
                </Box>
                <Text weight={'bold'} size={'medium'}>Payments demo</Text>
            </Box>
            <Box direction={'row'} gap={'32px'} width={'250px'}>
                <UserAccount />
            </Box>
        </Box>
    </HeaderContainer>
})

export default AppHeader
