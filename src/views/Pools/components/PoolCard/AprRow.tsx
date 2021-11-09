import { Flex, Text } from 'uikit'
import styled from 'styled-components'
import Balance from 'components/Balance'
import React from 'react'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

interface AprRowProps {
  pool: Pool
}

const StyledFlex = styled(Flex)`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 6px 20px;
`

const AprRow: React.FC<AprRowProps> = ({ pool }) => {
  const { isFinished, apr, earningToken, userData } = pool

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO

  return (
    <StyledFlex alignItems="center" justifyContent="space-between">
      <Flex flexDirection="column" alignItems="flex-start">
        <Text color="primary" textTransform="uppercase" bold fontSize="12px">
          {`${earningToken.symbol} Earned`}
        </Text>
        <Balance fontSize="18px" value={getBalanceNumber(earnings, earningToken.decimals)} isDisabled={isFinished} />
      </Flex>

      <Flex flexDirection="column" alignItems="flex-start">
        <Text color="primary" bold fontSize="12px">
          APR
        </Text>
        {isFinished || !apr ? (
          '-'
        ) : (
          <Balance fontSize="18px" isDisabled={isFinished} value={apr} decimals={2} unit="%" />
        )}
      </Flex>
    </StyledFlex>
  )
}

export default AprRow
