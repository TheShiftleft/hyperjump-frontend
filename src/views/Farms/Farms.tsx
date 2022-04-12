import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { NavLink, Route, useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, RowType, Text, Flex } from 'uikit'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePollFarmsData, usePriceFarmingTokenUsd } from 'state/hooks'
import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import PageHeader from 'components/PageHeader'
import { OptionProps } from 'components/Select/Select'
import ViewControls from 'components/ViewControls'
import getNetwork from 'utils/getNetwork'
import VersionBar from 'components/VersionBar'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/FarmTable/FarmTable'
import { RowProps } from './components/FarmTable/Row'
import { DesktopColumnSchema, ViewMode } from './components/types'

const NUMBER_OF_FARMS_VISIBLE = 12

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data, userDataLoaded } = useFarms()
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'hyper_farm_view' })
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('apr')
  const { config } = getNetwork()

  const isInactive = pathname.includes('history')
  const isActive = !isInactive

  usePollFarmsData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useState(!isActive)
  useEffect(() => {
    let isMounted = true
    if(isMounted) {
      setStakedOnly(!isActive)
    }
    return () => {
      isMounted = false
    }
  }, [isActive])

  const currentDate = Date.now()
  const farmsLP = data
  const activeFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid) && currentDate <= farm.endTime * 1000,
  )
  const inactiveFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 &&
      !isArchivedPid(farm.pid) &&
      ((!!farm.endTime && farm.multiplier === '0X') || currentDate > farm.endTime * 1000),
  )
  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) &&
      !!farm.endTime &&
      currentDate <= farm.endTime * 1000,
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) &&
      !!farm.endTime &&
      currentDate > farm.endTime * 1000,
  )

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
        const apr = isActive ? getFarmApr(new BigNumber(farm.poolWeight), farmingTokenPriceUsd, totalLiquidity) : 0
        return { ...farm, apr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [query, farmingTokenPriceUsd, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      farmsStaked = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }

    if (isInactive) {
      farmsStaked = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }

    return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    isActive,
    isInactive,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ])

  useEffect(() => {
    let isMounted = true
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        if(isMounted){
          setNumberOfFarmsVisible((farmsCurrentlyVisible) => farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE)
        }
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      if(isMounted){
        setObserverIsSet(true)
      }
    }
    return () => {
      isMounted = false
    }
  }, [farmsStakedMemoized, observerIsSet])

  const rowData = farmsStakedMemoized.map((farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address

    const row: RowProps = {
      apr: {
        value: farm.apr && farm.apr.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        multiplier: farm.multiplier,
        lpLabel: farm.lpSymbol.toUpperCase(),
        tokenAddress,
        quoteTokenAddress,
        farmingTokenPriceUsd,
        originalValue: farm.apr,
      },
      farm: {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: farm.lpSymbol.toUpperCase(),
        pid: farm.pid,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm?.userData?.earnings || 0)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    }

    return (
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                farmingTokenPriceUsd={farmingTokenPriceUsd}
                account={account}
                removed={false}
              />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                farmingTokenPriceUsd={farmingTokenPriceUsd}
                account={account}
                removed
              />
            ))}
          </Route>
          <Route exact path={`${path}/archived`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                farmingTokenPriceUsd={farmingTokenPriceUsd}
                account={account}
                removed
              />
            ))}
          </Route>
        </FlexLayout>
      </div>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      <PageHeader>
        <FlexLayout>
          <Image src="/images/asteroid-logo.png" alt="Asteroid Logo" width={318} height={105} />
          <Flex flexDirection="column">
            <Text fontSize="14px" bold>
              Welcome to the Asteroid Field, scalawag! Deposit LP tokens to mine Hyper{config.farmingToken.symbol}. You
              can then use your{' '}
              <Text color="primary" fontSize="14px" bold style={{ display: 'inline' }}>
                Hyper{config.farmingToken.symbol}{' '}
              </Text>
              to stake in the
              <NavLink exact activeClassName="active" to="/pools" id="mech-pools">
                <Text color="primary" fontSize="14px" bold style={{ display: 'inline' }}>
                  {' MECH Pools.'}
                </Text>
              </NavLink>
            </Text>
            <Text fontSize="14px" bold>
              There are NO deposit fees!
            </Text>
          </Flex>
        </FlexLayout>
      </PageHeader>
      <Page>
        <ViewControls
          rootPath="/farms"
          viewMode={viewMode}
          setViewMode={setViewMode}
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinished={stakedInactiveFarms.length > 0}
          handleSearchChange={handleChangeQuery}
          handleOptionChange={handleSortOptionChange}
          options={[
            {
              label: t('APR'),
              value: 'apr',
            },
            {
              label: t('Multiplier'),
              value: 'multiplier',
            },
            {
              label: t('Earned'),
              value: 'earned',
            },
            {
              label: t('Liquidity'),
              value: 'liquidity',
            },
          ]}
        />
        {renderContent()}
        <div ref={loadMoreRef} />
        <VersionBar />
      </Page>
    </>
  )
}

export default Farms
