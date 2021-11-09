import React from 'react'
import { Flex, Text, Button, Heading, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
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
  const { t } = useTranslation()
  const { onReward } = useSousHarvest(sousId, false)
  const { toastSuccess, toastError } = useToast()

  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const hasEarnings = earnings.toNumber() > 0

  const handleCollect = async () => {
    setIsPending(true)
    try {
      await onReward()
      toastSuccess(
        `${t('Harvested')}!`,
        t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
      )
      setIsPending(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
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
        <Flex>
          <Button disabled={!hasEarnings} isLoading={isPending} onClick={handleCollect}>
            {t('Collect')}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HarvestActions
