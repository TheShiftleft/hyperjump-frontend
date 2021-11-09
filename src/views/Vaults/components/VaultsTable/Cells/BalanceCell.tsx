import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints } from 'uikit'
import Balance from 'components/Balance'
import { getBalanceAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import BaseCell, { CellContent } from './BaseCell'

interface BalanceCellProps {
  balance?: BigNumber
  balanceUsd?: BigNumber
  title: string
}

const StyledCell = styled(BaseCell)`
`

const BalanceCell: React.FC<BalanceCellProps> = ({ balance, balanceUsd, title }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const fontSize = isXs || isSm ? "14px" : "18px"
  const subFontSize = isXs || isSm ? "11px" : "15px"
  const bal = balance ? getBalanceAmount(balance).toNumber() : 0
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
          {title}
        </Text>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Balance
              fontSize={fontSize}
              isDisabled={false}
              decimals={6}
              value={bal}
            />
            {balanceUsd?.isGreaterThan(0) && (
              <Balance
                fontSize={subFontSize}
                isDisabled={false}
                decimals={2}
                value={balanceUsd.toNumber()}
                prefix='$'
                marginTop='4px'
              />
            )}
          </Flex>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default BalanceCell
