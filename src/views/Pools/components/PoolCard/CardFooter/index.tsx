import React from 'react'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  Text,
} from 'uikit'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import usePoolTimingInfo from 'hooks/usePoolTimingInfo'

interface FooterProps {
  pool: Pool
  account: string
}

const FooterWrapper = styled(Flex)`
  padding: 0 24px 34px 24px;
  svg {
    height: 14px;
    width: 14px;
  }
`

const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
`


const Footer: React.FC<FooterProps> = ({ pool }) => {
  const { t } = useTranslation()

  const { totalStaked, isFinished } = pool

  const { shouldShowCountdown, untilStart, remaining } = usePoolTimingInfo(pool)
  const minutesRemaining = remaining / 60

  return (
    <FooterWrapper flexDirection="column">
      {shouldShowCountdown && untilStart === 0 && remaining > 0 && (
        <StyledDetails>
          <Text fontSize="12px" bold color="primary">
            {t('MINUTES LEFT')}:
          </Text>
          <Balance fontSize="12px" isDisabled={isFinished} value={minutesRemaining} decimals={0} />
        </StyledDetails>
      )}
      <StyledDetails>
        <Text fontSize="12px" bold color="primary">
          {t('TOTAL MECHS')}:
        </Text>
        <Balance fontSize="12px" isDisabled={isFinished} value={getBalanceNumber(totalStaked)} />
      </StyledDetails>
    </FooterWrapper>
  )
}

export default Footer
