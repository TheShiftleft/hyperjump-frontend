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
        <ButtonMenuItem id="zap-nav-link" to="/zap" as={Link}>
          {TranslateString(1142, 'Zap')}
        </ButtonMenuItem>
        <ButtonMenuItem id="warp-nav-link" to="/warp" as={Link}>
          {TranslateString(262, 'Warp(s00n)')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav