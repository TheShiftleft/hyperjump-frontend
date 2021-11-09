import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text } from 'uikit'
import { Farm } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import getNetwork from 'utils/getNetwork'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(13, 29, 54, 0.6);
  border-radius: 20px;
  padding: 12px;
  align-items: center;
  min-width: 162px;
  &:not(:first-child) {
    margin-top: 20px;
  }
  border: 1px solid ${(props) => props.theme.colors.primary};
`

const Container = styled.div`
  width: 100%;
`
interface FarmCardActionsProps {
  farm: Farm
  viewMode?: string
}

const EarningSection: React.FC<FarmCardActionsProps> = ({ farm, viewMode }) => {
  const { pid } = farm
  const { earnings: earningsAsString = 0 } = farm.userData || {}
  const earnings = new BigNumber(earningsAsString)
  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()
  const { config } = getNetwork()

  return (
    <Action className="earnings-widget">
      <Container>
        <Flex flexDirection={viewMode === 'card' ? 'row' : 'column'} justifyContent="space-between">
          <Flex flexDirection={viewMode === 'card' ? 'column' : 'row'} justifyContent="space-between">
            <Text color="primary" fontSize="12px" bold>
              {`${config.farmingToken.symbol} Earned`}
            </Text>
            <Text color={rawEarningsBalance === 0 ? 'textDisabled' : 'white'} fontSize="18px" bold>
              {displayBalance}
            </Text>
          </Flex>
          <HarvestAction earnings={earnings} pid={pid} />
        </Flex>
      </Container>
    </Action>
  )
}

export default EarningSection
