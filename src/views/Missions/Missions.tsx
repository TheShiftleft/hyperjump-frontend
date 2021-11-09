import React from 'react'
import styled from 'styled-components'
import { BaseLayout } from 'uikit'
import Page from 'components/layout/Page'
import HyperHeist from 'views/Missions/components/HyperHeist'
import MissionMessage from './components/MissionMessage'

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 16px;
  grid-gap: 16px;

  & > div {
    grid-column: span 6;
    width: 100%;
    background-color: rgba(21, 43, 78, 0.6);
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 6;
    }
  }
`

const Missions: React.FC = () => {
  return (
    <Page>
      <Cards>
        <MissionMessage />
      </Cards>
    </Page>
  )
}

export default Missions
