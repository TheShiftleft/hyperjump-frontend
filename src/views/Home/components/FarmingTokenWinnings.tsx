import React from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
`

interface FarmingTokenWinningsProps {
  claimAmount: BigNumber
}

const FarmingTokenWinnings: React.FC<FarmingTokenWinningsProps> = ({ claimAmount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const farmingTokenAmount = getBalanceNumber(claimAmount)
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const claimAmountBusd = new BigNumber(farmingTokenAmount).multipliedBy(farmingTokenPriceUsd).toNumber()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '76px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={farmingTokenAmount} lineHeight="1.5" />
      {farmingTokenPriceUsd.gt(0) && <CardBusdValue value={claimAmountBusd} decimals={2} />}
    </Block>
  )
}

export default FarmingTokenWinnings
