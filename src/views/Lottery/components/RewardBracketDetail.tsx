import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import getNetwork from 'utils/getNetwork'

const { config } = getNetwork()
const rewardToken = ` ${config.farmingToken.symbol}`

interface RewardBracketDetailProps {
  farmingTokenAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
}

const RewardBracketDetail: React.FC<RewardBracketDetailProps> = ({
  rewardBracket,
  farmingTokenAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
}) => {
  const { t } = useTranslation()
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const priceInUsd = farmingTokenAmount.times(farmingTokenPriceUsd)

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    if (rewardBracket === 3) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column">
      <Text color={isBurn ? '#d10504' : 'white'}>{getRewardText()}</Text>
      <>
        {priceInUsd.isNaN() ? (
          <Skeleton my="2px" height={12} width={90} />
        ) : (
          <Balance
            fontSize="20px"
            color="#49ceeb"
            bold
            unit={rewardToken}
            value={getBalanceNumber(farmingTokenAmount)}
            decimals={0}
          />
        )}
        {priceInUsd.isNaN() ? (
          <Skeleton my="2px" height={12} width={70} />
        ) : (
          <Balance fontSize="12px" prefix="~$" value={getBalanceNumber(priceInUsd)} decimals={0} />
        )}
        {isHistoricRound && farmingTokenAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px">
                {getFullDisplayBalance(farmingTokenAmount.div(parseInt(numberWinners, 10)), 18, 2)} {rewardToken}{' '}
                {t('each')}
              </Text>
            )}
            <Text fontSize="12px">
              {numberWinners} {t('Winners')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
