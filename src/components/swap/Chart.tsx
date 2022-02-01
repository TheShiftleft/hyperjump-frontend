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
export default function Chart({tokenPair, network}) {
    const networkName = network === 'FTM' ? 'fantom' : 'bsc'
    const url = tokenPair !== undefined ? `https://dexscreener.com/${networkName}/${tokenPair}?embed=1&theme=dark` : `https://dexscreener.com/${networkName}/0x?embed=1&theme=dark`
    return(
        <ChartFrame 
            url={url}
        />
    )
}