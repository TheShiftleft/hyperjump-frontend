import React, { useState } from 'react'
import { Flex, Text, Button, Heading, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useSousStake } from 'hooks/useStake'
import { useSousHarvest } from 'hooks/useHarvest'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isLoading?: boolean
  isPending?: boolean
  setIsPending: (b: boolean) => void
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  earningTokenPrice,
  setIsPending,
  isPending = false,
  isLoading = false,
}) => {
  const { onReward } = useSousHarvest(sousId, false)
  const { toastSuccess, toastError } = useToast()

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)

  const { onStake } = useSousStake(sousId, false)
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const [pendingTx, setPendingTx] = useState(false)

  const handleCompound = async () => {
    setIsPending(true)
    try {
      await onStake(fullBalance, earningToken.decimals)
      toastSuccess('Compounded!', `Your ${earningToken.symbol} earnings have been assembled into !`)
      setIsPending(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setIsPending(false)
    }
  }

  const handleCollect = async () => {
    setIsPending(true)
    try {
      await onReward()
      toastSuccess('Harvested!', `Your ${earningToken.symbol} earnings have been sent to your wallet!`)
      setIsPending(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setIsPending(false)
    }
  }

  return (
    <Flex flexDirection="column" mb="16px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
              ) : (
                <Heading color="textDisabled">0</Heading>
              )}
              {earningTokenPrice !== 0 && (
                <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                  ~
                  {hasEarnings ? (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      value={earningTokenDollarBalance}
                      unit=" USD"
                    />
                  ) : (
                    '0 USD'
                  )}
                </Text>
              )}
            </>
          )}
        </Flex>
        <Flex flexDirection="column">
          <Button disabled={!hasEarnings} className="col-staked-btn" isLoading={isPending} onClick={handleCollect}>
            Collect
          </Button>
          <Button className="col-staked-btn" disabled={!hasEarnings} isLoading={isPending} onClick={handleCompound}>
            Compound
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HarvestActions
