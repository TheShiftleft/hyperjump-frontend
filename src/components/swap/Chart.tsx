import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import styled from 'styled-components'
import useWindowDimensions from 'hooks/useWindowDimension'
import Modal from '../Modal'

const ChartFrame = styled(Iframe)`
    position: relative;
    width:100%;
    flex: 2;
`
export default function Chart({tokenPair, network}) {
    
    const {width} = useWindowDimensions()
    const networkName = network === 'FTM' ? 'fantom' : 'bsc'
    const url = tokenPair !== undefined ? `https://dexscreener.com/${networkName}/${tokenPair}?embed=1&theme=dark&trades=1` : `https://dexscreener.com/${networkName}/0x?embed=1&theme=dark&trades=0`
    
    return(
        <ChartFrame
            url={width >= 1527 ? url.concat('&info=0') : url}
        /> 
    )
}