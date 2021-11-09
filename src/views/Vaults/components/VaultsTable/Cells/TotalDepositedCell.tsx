import React from 'react'
import { Flex, Text, useMatchBreakpoints } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  tvl: BigNumber
}

const StyledCell = styled(BaseCell)`
  flex-basis: 20%;
`

const TotalDepositedCell: React.FC<TotalStakedCellProps> = ({ tvl }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const fontSize = isXs || isSm ? '15px' : '20px'

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="14px" color="textSubtle" textAlign="left">
          {t('Vault TVL')}
        </Text>
        <Flex height="100%" alignItems="center">
          <Balance fontSize={fontSize} value={tvl.toNumber()} decimals={0} prefix="$" />
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalDepositedCell
