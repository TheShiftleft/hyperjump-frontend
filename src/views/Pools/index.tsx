import { Flex, Image, Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFetchPublicPoolsData, usePools } from 'state/hooks'
import { Pool } from 'state/types'
import styled from 'styled-components'
import { latinise } from 'utils/latinise'
import getNetwork from 'utils/getNetwork'
import PoolCard from './components/PoolCard'
import MechPoolCard from './components/MechPoolCard'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolTabButtons from './components/PoolTabButtons'
import { ViewMode } from './components/ToggleView/ToggleView'
import getAprData from './helpers'
import MechConverter from './components/MechConverter'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'hyper_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'hyper_farm_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const { config } = getNetwork()

  const [finishedPools, openPools] = partition(pools, (pool) => pool.isFinished)
  const stakedOnlyFinishedPools = finishedPools.filter((pool) => {
    return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
  })
  const stakedOnlyOpenPools = openPools.filter((pool) => {
    return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
  })
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  const showFinishedPools = location.pathname.includes('history')

  useFetchPublicPoolsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        return orderBy(poolsToSort, (pool: Pool) => getAprData(pool), 'desc')
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

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) =>
        pool.sousId === 0 ? (
          <MechPoolCard key={pool.sousId} pool={pool} account={account} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={poolsToShow()} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Image mx="auto" mt="12px" src="/images/staking-logo.png" alt="MECH WOKRSHOP" width={319} height={105} />
            <Text color="text" fontSize="13px" bold mt="16px">
              {t(
                `Listen up, stardog! This is the HyperMECH workshop. Use your Hyper${config.farmingToken.symbol} to build HyperMECHS. It takes 5 Hyper${config.farmingToken.symbol} to build 1 HyperMECH. HyperMECHS will mine other tokens for you and collect more Hyper${config.farmingToken.symbol} along the way.`,
              )}
            </Text>
            <Text color="text" fontSize="13px" bold mt="10px">
              {t('HIGH APR, LITTLE RISK!')}
            </Text>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <MechConverter pool={pools.find((p) => p.sousId === 0)} />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls justifyContent="space-between">
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <SearchSortContainer>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <ControlStretch>
                <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
              </ControlStretch>
            </Flex>
          </SearchSortContainer>
        </PoolControls>
        {showFinishedPools && (
          <Text fontSize="18px" color="failure" pb="32px">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={loadMoreRef} />
        {/* <HelpButton /> */}
      </Page>
    </>
  )
}

export default Pools
