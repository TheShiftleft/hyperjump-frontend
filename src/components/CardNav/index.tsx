import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'uikit'

import useI18n from 'hooks/useI18n'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'

const StyledNav = styled.div`
  margin-bottom: 40px;
`

function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const TranslateString = useI18n()
  const { config } = getNetwork()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="primary">
        <ButtonMenuItem
          id="swap-nav-link"
          to={`/swap?inputCurrency=${config.baseCurrency.symbol}&outputCurrency=${getAddress(
            config.farmingToken.address,
          )}`}
          as={Link}
        >
          {TranslateString(1142, 'Swap')}
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
          {TranslateString(262, 'Liquidity')}
        </ButtonMenuItem>
       {/*  <ButtonMenuItem id="bridge-nav-link" to="/bridge" as={Link}>
          {TranslateString(262, 'Bridge')}
        </ButtonMenuItem> */}
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
