import { Flex, Heading, Image, RowType } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import FlexLayout from 'components/layout/Flex'
import getNetwork from 'utils/getNetwork'

import { useVaults } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import ViewControls from 'components/ViewControls'
import { useLocation } from 'react-router-dom'
import { OptionProps } from 'components/Select/Select'
import { orderBy, partition } from 'lodash'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { latinise } from 'utils/latinise'
import { VaultRowProps } from './components/VaultsTable/VaultRow'
import VaultsTable from './components/VaultsTable/VaultsTable'
import { DesktopColumnSchema, ViewMode } from './components/types'

const NUMBER_OF_VAULTS_VISIBLE = 12

const Vaults: React.FC = () => {
  const { pathname } = useLocation()
  const { account } = useWeb3React()
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const { vaults, apys, prices, balances, allowances } = useVaults(account)
  const { t } = useTranslation()
  const { config } = getNetwork()

  const vaultsState = vaults.map((vault, i) => {
    const price = prices[vault?.oracle][vault?.oracleId] || 0
    const walletBalance = new BigNumber(balances[vault?.name]?.tokenBalance)
    const sharesBalance = new BigNumber(balances[vault?.earnedToken]?.tokenBalance)
    const amountDeposited = sharesBalance.multipliedBy(new BigNumber(vault?.pricePerFullShare))
    const allowance = new BigNumber(allowances[i])
    const apy = new BigNumber(apys[vault?.id])
    const tvl = new BigNumber(vault?.tvl).multipliedBy(price).dividedBy(BIG_TEN.pow(vault?.tokenDecimals))
    return {
      vault,
      apy,
      price,
      tvl,
      allowance,
      amountDeposited,
      walletBalance,
    }
  })
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [numberOfVaultsVisible, setNumberOfVaultsVisible] = useState(NUMBER_OF_VAULTS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  const [activeVaults, inactiveVaults] = partition(vaultsState, (vault) => vault?.vault?.status === 'active')
  const stakedOnlyVaults = activeVaults.filter((vault) => vault?.amountDeposited.isGreaterThan(0))
  const stakedInactiveVaults = inactiveVaults.filter((vault) => vault?.amountDeposited.isGreaterThan(0))

  const [stakedOnly, setStakedOnly] = useState(!isActive)
  useEffect(() => {
    setStakedOnly(!isActive)
  }, [isActive])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const vaultsStakedMemoized = useMemo(() => {
    let selectedVaults = []
    if (isActive) {
      selectedVaults = stakedOnly ? stakedOnlyVaults : activeVaults
    }
    if (isInactive) {
      selectedVaults = stakedOnly ? stakedInactiveVaults : inactiveVaults
    }

    const sortVaults = (vaultsToSort: VaultRowProps[]): VaultRowProps[] => {
      switch (sortOption) {
        case 'apy':
          return orderBy(vaultsToSort, (vault) => vault.apy.toNumber(), 'desc')
        case 'amountDeposited':
          return orderBy(vaultsToSort, (vault) => vault.amountDeposited.toNumber(), 'desc')
        case 'walletBalance':
          return orderBy(vaultsToSort, (vault) => vault.walletBalance.toNumber(), 'desc')
        case 'tvl':
          return orderBy(vaultsToSort, (vault) => vault.tvl.toNumber(), 'desc')
        default:
          return vaultsToSort
      }
    }
    const filterQuery = (vx: Array<VaultRowProps>) => {
      if (!query) {
        return vx
      }
      const lowercaseQuery = latinise(query.toLowerCase())
      return vx.filter((v) => {
        return latinise(v.vault.name.toLowerCase()).includes(lowercaseQuery)
      })
    }

    return sortVaults(filterQuery(selectedVaults)).slice(0, numberOfVaultsVisible)
  }, [
    isActive,
    isInactive,
    numberOfVaultsVisible,
    stakedOnly,
    stakedOnlyVaults,
    activeVaults,
    stakedInactiveVaults,
    inactiveVaults,
    sortOption,
    query,
  ])

  const renderContent = (): JSX.Element => {
    const columnSchema = DesktopColumnSchema

    const columns = columnSchema.map((column) => ({
      id: column.id,
      name: column.name,
      label: column.label,
      sort: (a: RowType<VaultRowProps>, b: RowType<VaultRowProps>) => {
        switch (column.name) {
          case 'vault':
            return b.id - a.id
          case 'apy':
            if (a.original.apy && b.original.apy) {
              return a.original.apy.toNumber() - b.original.apy.toNumber()
            }
            return 0
          case 'walletBalance':
            if (a.original.walletBalance && b.original.walletBalance) {
              return a.original.walletBalance.toNumber() - b.original.walletBalance.toNumber()
            }
            return 0
          case 'amountDeposited':
            if (a.original.amountDeposited && b.original.amountDeposited) {
              return a.original.amountDeposited.toNumber() - b.original.amountDeposited.toNumber()
            }
            return 0
          case 'tvl':
            return a.original.tvl.toNumber() - b.original.tvl.toNumber()
          default:
            return 1
        }
      },
      sortable: column.sortable,
    }))

    return <VaultsTable data={vaultsStakedMemoized} columns={columns} />
  }

  useEffect(() => {
    const showMoreVaults = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfVaultsVisible((vaultsCurrentlyVisible) => vaultsCurrentlyVisible + NUMBER_OF_VAULTS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreVaults, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [vaultsStakedMemoized, observerIsSet])

  return (
    <>
      <PageHeader>
        <FlexLayout>
          <Image mx="auto" mt="12px" src="/images/starvaults-logo.png" alt="Starvaults logo" width={319} height={105} />
          <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
              <Heading scale="md" color="text" style={{ flexDirection: 'column' }}>
                <p>StarVaults will automatically compound your treasure.</p>
                <p>Just deposit, sit back and enjoy the voyage.</p>
                <p style={{ fontSize: '12px' }}>
                  Vaults are compounded every {config.vaultCompoundTime} and there are NO fees on HyperJump Farm
                  deposits.
                </p>
              </Heading>
            </Flex>
          </Flex>
        </FlexLayout>
      </PageHeader>
      <Page>
        <ViewControls
          rootPath="/vaults"
          viewMode={ViewMode.TABLE}
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinished={stakedInactiveVaults.length > 0}
          handleSearchChange={handleSearchChange}
          handleOptionChange={handleSortOptionChange}
          options={[
            {
              label: t('Hot'),
              value: 'hot',
            },
            {
              label: t('APY'),
              value: 'apy',
            },
            {
              label: t('Wallet balance'),
              value: 'walletBalance',
            },
            {
              label: t('Deposited'),
              value: 'amountDeposited',
            },
            {
              label: t('Liquidity'),
              value: 'tvl',
            },
          ]}
        />
        {renderContent()}
        <div ref={loadMoreRef} />
      </Page>
    </>
  )
}

export default Vaults
