import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import styled from 'styled-components'

const ChartFrame = styled(Iframe)`
    position: relative;
    height: 90vh;
    top: 0;
    left: 0;
    border: 0;
    flex: 2;
    display: none !important;
    ${({ theme }) => theme.mediaQueries.xs} {
    }

    ${({ theme }) => theme.mediaQueries.sm} {
    }
    
    ${({ theme }) => theme.mediaQueries.lg} {
        display: block !important;
    }
`
export default function Chart() {

    return(
        <ChartFrame 
            url="https://dexscreener.com/fantom/0x5448a3B93731e7C1d6e6310Cb614843FbaC21f69?embed=1&theme=dark"
        />
    )
}