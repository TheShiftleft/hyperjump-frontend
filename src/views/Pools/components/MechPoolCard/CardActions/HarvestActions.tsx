import React, { useState } from 'react'
import { Flex, Text, Button, Heading, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useSousStake } from 'hooks/useStake'
import useToast from 'hooks/useToast'
import { useSousHarvest } from 'hooks/useHarvest'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  earningTokenPrice,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const { onStake } = useSousStake(sousId, false)
  const { onReward } = useSousHarvest(sousId, false)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  console.log('hasEarnings', hasEarnings, fullBalance)
  const handleCompound = async () => {
    setPendingTx(true)
    try {
      await onStake(fullBalance, earningToken.decimals)
      toastSuccess(
        `${t('Compounded')}!`,
        t('Your %symbol% earnings have been assembled into MECHS!', { symbol: earningToken.symbol }),
      )
      setPendingTx(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }

  const handleCollect = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess(
        `${t('Harvested')}!`,
        t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
      )
      setPendingTx(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }

  return (
    <Flex flexDirection="column" mb="16px">
      <Flex flexDirection="column">{isLoading ? <Skeleton width="80px" height="48px" /> : <></>}</Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <StyledButton disabled={!hasEarnings} isLoading={pendingTx} onClick={handleCollect}>
          {t('Collect')}
        </StyledButton>
        <StyledButton disabled={!hasEarnings} isLoading={pendingTx} onClick={handleCompound}>
          {t('Compound')}
        </StyledButton>
      </Flex>
    </Flex>
  )
}

export default HarvestActions

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 20px;
  width: 90px;
  padding: 20px 10px;
  color: white;
  font-size: 15px;
  line-height: 1;
`
