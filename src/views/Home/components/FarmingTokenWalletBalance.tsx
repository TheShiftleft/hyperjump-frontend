import React from 'react'
import { Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getFarmingTokenAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardValue from './CardValue'

const FarmingTokenWalletBalance = () => {
  const { t } = useTranslation()
  const { balance: farmingTokenBalance } = useTokenBalance(getFarmingTokenAddress())
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const busdBalance = new BigNumber(getBalanceNumber(farmingTokenBalance)).multipliedBy(farmingTokenPriceUsd).toNumber()
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '54px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <>
      <CardValue fontSize="16px" value={getBalanceNumber(farmingTokenBalance)} usdval={farmingTokenPriceUsd.gt(0) && busdBalance} />
    </>
  )
}

export default FarmingTokenWalletBalance
