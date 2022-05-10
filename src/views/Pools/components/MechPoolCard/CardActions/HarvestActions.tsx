import React, { useState } from 'react'
import { Flex, Text, Button, Heading, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Token } from 'config/constants/types'
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
  const { onStake } = useSousStake(sousId, false)
  const { onReward } = useSousHarvest(sousId, false)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const handleCompound = async () => {
    setPendingTx(true)
    try {
      await onStake(fullBalance, earningToken.decimals)
      toastSuccess('Compounded!', `Your ${earningToken.symbol}`)
      setPendingTx(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setPendingTx(false)
    }
  }

  const handleCollect = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess('Harvested!', `Your ${earningToken.symbol} earnings have been sent to your wallet!`)
      setPendingTx(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setPendingTx(false)
    }
  }

  return (
    <Flex flexDirection="column" mb="16px">
      <Flex flexDirection="column">{isLoading ? <Skeleton width="80px" height="48px" /> : <></>}</Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <StyledButton disabled={!hasEarnings} isLoading={pendingTx} onClick={handleCollect}>
          Collect
        </StyledButton>
        <StyledButton disabled={!hasEarnings} isLoading={pendingTx} onClick={handleCompound}>
          Compound
        </StyledButton>
      </Flex>
    </Flex>
  )
}

export default HarvestActions
