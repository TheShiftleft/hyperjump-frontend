import React from 'react'
import { Text, Heading } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { getOldFarmingTokenAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const OldFarmingTokenWalletBalance = () => {
  const { balance: oldFarmingTokenBalance } = useTokenBalance(getOldFarmingTokenAddress())
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '54px' }}>
        Locked
      </Text>
    )
  }

  return (
    <>
      <Heading mb="10px">{oldFarmingTokenBalance && <CardValue value={oldFarmingTokenBalance.toNumber()} />}</Heading>
    </>
  )
}

export default OldFarmingTokenWalletBalance
