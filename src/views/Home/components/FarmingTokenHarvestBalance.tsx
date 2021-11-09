import React from 'react'
import { Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useAllEarnings from 'hooks/useAllEarnings'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import CardValue from './CardValue'

const FarmingTokenHarvestBalance = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    const earningNumber = new BigNumber(earning)
    if (earningNumber.eq(0)) {
      return accum
    }
    return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
  }, 0)
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const earningsBusd = new BigNumber(earningsSum).multipliedBy(farmingTokenPriceUsd).toNumber()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '16px' }}>
        {t('Locked')}
      </Text>
    )
  }
  return (
    <>
      <CardValue fontSize="16px" value={earningsSum} usdval={farmingTokenPriceUsd.gt(0) && earningsBusd} />
    </>
  )
}

export default FarmingTokenHarvestBalance
