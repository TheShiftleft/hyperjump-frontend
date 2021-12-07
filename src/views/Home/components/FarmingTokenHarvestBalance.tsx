import React, { useEffect, useRef, useState } from 'react'
import { Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useAllEarnings from 'hooks/useAllEarnings'
import { usePriceFarmingTokenUsd, usePools } from 'state/hooks'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useLocation } from 'react-router-dom'
import orderBy from 'lodash/orderBy'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { Pool } from 'state/types'
import partition from 'lodash/partition'
import { latinise } from 'utils/latinise'
import { BIG_ZERO } from 'utils/bigNumber'
import usePersistState from 'hooks/usePersistState'
import CardValue from './CardValue'

const FarmingTokenHarvestBalance = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePools(account)
  const allEarnings = useAllEarnings()
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'hyper_pool_staked' })
  const showFinishedPools = location.pathname.includes('history')
  const earningsSum = allEarnings.reduce((accum, earning) => {
    const earningNumber = new BigNumber(earning)
    if (earningNumber.eq(0)) {
      return accum
    }
    return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
  }, 0)
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const earningsBusd = new BigNumber(earningsSum).multipliedBy(farmingTokenPriceUsd).toNumber()

  const NUMBER_OF_POOLS_VISIBLE = 12

  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [sortOption, setSortOption] = useState('hot')
  const [searchQuery, setSearchQuery] = useState('')
  const [finishedPools, openPools] = partition(pools, (pool) => pool.isFinished)
  const stakedOnlyFinishedPools = finishedPools.filter((pool) => {
    return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
  })
  const stakedOnlyOpenPools = openPools.filter((pool) => {
    return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
  })

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(poolsToSort, (pool: Pool) => pool.totalStaked.toNumber(), 'desc')
      default:
        return poolsToSort
    }
  }

  const poolsToShow = () => {
    let chosenPools = []
    if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
      )
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  const poolsData = poolsToShow()
  const earnings  = poolsData[0]?.userData ? new BigNumber(poolsData[0].userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, 18)
  const hasEarnings = earnings.gt(0)
  const displayBalance = hasEarnings ? earningTokenBalance : 0
  
  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '16px' }}>
        {t('Locked')}
      </Text>
    )
  }
  return (
    <>
      <CardValue fontSize="16px" value={displayBalance} usdval={farmingTokenPriceUsd.gt(0) && earningsBusd} />
    </>
  )
}

export default FarmingTokenHarvestBalance
