import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import styled from 'styled-components'

const ChartFrame = styled(Iframe)`
    position: relative;
    width:100%;
    height: 90vh;
    top: 0;
    left: 0;
    border: 0;
    flex: 2;
    display: none !important;
    min-width: 995px;
    ${({ theme }) => theme.mediaQueries.lg} {
        display: block !important;
    }
`
export default function Chart({tokenPair, network}) {
    const networkName = network === 'FTM' ? 'fantom' : 'bsc'
    const url = tokenPair !== undefined ? `https://dexscreener.com/${networkName}/${tokenPair}?embed=0&theme=dark&info=0&trades=0` : `https://dexscreener.com/${networkName}/0x?embed=1&theme=dark&info=0&trades=0`
    return(
        <ChartFrame 
            url={url}
        />
    )
}