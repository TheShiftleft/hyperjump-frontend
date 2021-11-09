import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button, ButtonMenu, ButtonMenuItem, SwapButtonMenu, SwapButtonMenuItem } from 'uikit'
import LiquidSVG from './Icons/Liquid'
import SwapSVG from './Icons/Swap'
import ZapSVG from './Icons/Zap'

const StyledSwapNav = styled.div`
  margin-bottom: 20px;
`

const ButtonIcon = styled.img`
  width: auto;
  height: 90px;
  margin-top: -30px;
  margin-bottom: -30px;
  user-select: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 110px;
    margin-top: -30px;
    margin-bottom: -30px;
  }
`

const Vertical = styled.hr`
  width: 2px;
  height: 25px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 50px;
  }
`

function SwapNav({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <StyledSwapNav>
      <SwapButtonMenu activeIndex={activeIndex} scale="sm" variant="text">
        <SwapButtonMenuItem
          id="swap-nav-link"
          to="/swap?inputCurrency=BNB&outputCurrency=0x5eF5994fA33FF4eB6c82d51ee1DC145c546065Bd"
          as={Link}
        >
          <SwapSVG fill={activeIndex === 0 ? '#44c4e2' : 'white'} />
        </SwapButtonMenuItem>
        <Vertical />
        <SwapButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
          <LiquidSVG fill={activeIndex === 2 ? '#44c4e2' : 'white'} />
        </SwapButtonMenuItem>
        <Vertical />
        <SwapButtonMenuItem id="pool-nav-link" to="/zap" as={Link}>
          <ZapSVG fill={activeIndex === 4 ? '#44c4e2' : 'white'} height="45px" width="70px" />
        </SwapButtonMenuItem>
      </SwapButtonMenu>
    </StyledSwapNav>
  )
}

export default SwapNav
