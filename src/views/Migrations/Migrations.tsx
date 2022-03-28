import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading } from 'uikit'

import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import JumpConverter from './components/JumpConverter'
import MechConverter from './components/MechConverter'
import LpRewardsClaimer from './components/LpRewardsClaimer'
import FarmV20Migrator from './components/FarmV20Migrator'

const Migrations: React.FC = () => {
  const [showFarm, setShowFarm] = useState(true)
  const [showMech, setShowMech] = useState(false)
  const [showLp, setShowLp] = useState(false)
  const [showJump, setShowJump] = useState(false)

  const { account } = useWeb3React()

  const handleFarm = () => {
    setShowFarm(true)
    setShowMech(false)
    setShowLp(false)
    setShowJump(false)
  }

  const handleMech = () => {
    setShowFarm(false)
    setShowMech(true)
    setShowLp(false)
    setShowJump(false)
  }

  const handleLp = () => {
    setShowFarm(false)
    setShowMech(false)
    setShowLp(true)
    setShowJump(false)
  }

  const handleJump = () => {
    setShowFarm(false)
    setShowMech(false)
    setShowLp(false)
    setShowJump(true)
  }

  return (
    <Page>
      {!account ? (
        <Heading>Please connect!</Heading>
      ) : (
        <Container>
          <Column>
            <Row>
              <MigrateButton
                onClick={() => {
                  handleFarm()
                }}
              >
                FARM MIGRATOR
              </MigrateButton>
              <MigrateButton
                onClick={() => {
                  handleLp()
                }}
              >
                LP CLAIM
              </MigrateButton>
              <MigrateButton
                onClick={() => {
                  handleJump()
                }}
              >
                JUMP CONVERTER
              </MigrateButton>
              <MigrateButton
                onClick={() => {
                  handleMech()
                }}
              >
                MECH CONVERTER
              </MigrateButton>
            </Row>
            {showFarm && <FarmV20Migrator />}
            {showLp && <LpRewardsClaimer />}
            {showJump && <JumpConverter />}
            {showMech && <MechConverter />}
          </Column>
        </Container>
      )}
    </Page>
  )
}

export default Migrations

const Container = styled(Flex)`
  grid-gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.xs} {
    justify-content: center;
  }
`
const Column = styled(Flex)`
  flex: 1;
  flex-direction: column;
  grid-gap: 16px;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-width: 375px;
    min-width: 370px;
  }
`
const Row = styled(Flex)`
  flex: 1;
  flex-direction: row;
  grid-gap: 16px;
  justify-content: space-evenly;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-width: 375px;
    min-width: 370px;
  }
`
// Styling
const MigrateButton = styled(Button)`
  max-height: 32px;
  min-width: 120px;
  padding: 16px 8px !important;
  border-radius: 5px;
  color: black;
`
