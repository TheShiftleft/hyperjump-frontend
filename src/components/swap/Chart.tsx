import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import styled from 'styled-components'
import useWindowDimensions from 'hooks/useWindowDimension'
import Modal from '../Modal'

const ChartFrame = styled(Iframe)`
    position: relative;
    width:100%;
    top: 0;
    left: 0;
    border: 0;
    flex: 2;
    @media(min-width: 1400px) {
        min-width: 992px;
    }
`
export default function Chart({tokenPair, network, setShowChart, showChart, setModalOpen, modalOpen}) {
    
    const {width} = useWindowDimensions()
    const enableModal = width < 1400
    const showModal = modalOpen && showChart
    const networkName = network === 'FTM' ? 'fantom' : 'bsc'
    const url = tokenPair !== undefined ? `https://dexscreener.com/${networkName}/${tokenPair}?embed=1&theme=dark&trades=1` : `https://dexscreener.com/${networkName}/0x?embed=1&theme=dark&trades=0`
    
    return(
        <>
            {enableModal ? 
                <Modal  isOpen={showModal} onDismiss={() => {setModalOpen(!modalOpen); setShowChart(!showChart)}} maxHeight={90} minHeight={80} maxWidth={90}>
                    <>
                        <ChartFrame
                            url={width > 1168 ? url.concat('&info=0') : url}
                        />
                    </>
                </Modal>
            :
                <ChartFrame
                url={url.concat('&info=0')}
            /> 
            }
        </>
    )
}