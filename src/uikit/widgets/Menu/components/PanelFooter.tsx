import React from 'react'
import styled from 'styled-components'
import { CogIcon } from '../../../components/Svg'
import IconButton from '../../../components/Button/IconButton'
import { MENU_ENTRY_HEIGHT } from '../config'
import { PanelProps, PushedProps } from '../types'
import SocialLinks from './SocialLinks'
import FarmingTokenPrice from './FarmingTokenPrice'

interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  flex: none;
  padding: 8px 4px;
  border-radius: 32px;
`

const SocialEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 32px;
`

const PanelFooter: React.FC<Props> = ({ isPushed, pushNav, farmingTokenPriceUsd }) => {
  if (!isPushed) {
    return (
      <Container>
        <IconButton variant="text" onClick={() => pushNav(true)}>
          <CogIcon />
        </IconButton>
      </Container>
    )
  }

  return (
    <Container>
      <FarmingTokenPrice farmingTokenPriceUsd={farmingTokenPriceUsd} />
      <a href="https://www.certik.org/projects/hyperjump" rel="noreferrer" target="_blank">
        <img src="/images/certik-white.png" alt="Certik Audited!" width={200} height={67} />
      </a>
      <SocialEntry>
        <SocialLinks />
      </SocialEntry>
    </Container>
  )
}

export default PanelFooter
