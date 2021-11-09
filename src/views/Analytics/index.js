import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ApolloProvider } from 'react-apollo'
import Web3 from 'web3'
import { Route, Switch, Router, Redirect, useRouteMatch } from 'react-router-dom'
import history from '../../routerHistory'
import { client } from './apollo/client'
import GlobalPage from './pages/GlobalPage'
import TokenPage from './pages/TokenPage'
import PairPage from './pages/PairPage'
import { useGlobalData, useGlobalChartData } from '../../contexts/Analytics/GlobalData'
import { isAddress } from '../../utils/analytics'
import AccountPage from './pages/AccountPage'
import AllTokensPage from './pages/AllTokensPage'
import AllPairsPage from './pages/AllPairsPage'
import PinnedData from './components/PinnedData'

import AccountLookup from './pages/AccountLookup'
import { OVERVIEW_TOKEN_BLACKLIST, PAIR_BLACKLIST } from '../../config/constants/analytics'
import LocalLoader from './components/LocalLoader'
import { useLatestBlock } from '../../contexts/Analytics/Application'

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const WarningBanner = styled.div`
  background-color: ${({ theme }) => theme.colors.bg1};
  padding: 1.5rem;
  color: white;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
  background-size: 100% auto;
`

function Analytics() {
  const [savedOpen, setSavedOpen] = useState(false)
  const [bscLatestBlock, setBscLatestBlock] = useState()
  const globalData = useGlobalData()
  const globalChartData = useGlobalChartData()
  const latestBlock = useLatestBlock()
  // const headBlock = useHeadBlock() // show warning// //
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_NETWORK_URL))
  let { path, url } = useRouteMatch();

  useEffect(() => {
    async function getCurrentBlock() {
      const block = await web3.eth.getBlock('latest')
      setBscLatestBlock(block.number)
    }
    getCurrentBlock()
  }, [web3.eth])

  const blockDiff = bscLatestBlock - latestBlock
  const timeDiff = parseInt((blockDiff * 3) / 60)

  return (
      <AppWrapper>
        {timeDiff > 10 && (
          <WarningWrapper>
            <WarningBanner>
              {`>> Site has synced to block ${latestBlock} / ${bscLatestBlock} (app. ${timeDiff} mins behind) <<`}
            </WarningBanner>
          </WarningWrapper>
        )}
        {latestBlock &&
        globalData &&
        Object.keys(globalData).length > 0 &&
        globalChartData &&
        Object.keys(globalChartData).length > 0 ? (
            <>
              <Route
                exact
                strict
                path={`${path}/token/:tokenAddress`}
                render={({ match }) => {
                  if (OVERVIEW_TOKEN_BLACKLIST.includes(match.params.tokenAddress.toLowerCase())) {
                    return <Redirect to="/analytics/overview" />
                  }
                  if (isAddress(match.params.tokenAddress.toLowerCase())) {
                    return (
                      <TokenPage address={match.params.tokenAddress.toLowerCase()} />
                    )
                  } 
                  return <Redirect to="/analytics/overview" />
                }}
              />
              <Route
                exact
                strict
                path={`${path}/pair/:pairAddress`}
                render={({ match }) => {
                  if (PAIR_BLACKLIST.includes(match.params.pairAddress.toLowerCase())) {
                    return <Redirect to="/analytics/overview" />
                  }
                  if (isAddress(match.params.pairAddress.toLowerCase())) {
                    return (
                      <PairPage pairAddress={match.params.pairAddress.toLowerCase()} />
                    )
                  }
                  return <Redirect to="/analytics/overview" />
                }}
              />
              <Route
                exact
                strict
                path={`${path}/account/:accountAddress`}
                render={({ match }) => {
                  if (isAddress(match.params.accountAddress.toLowerCase())) {
                    return (
                      <AccountPage account={match.params.accountAddress.toLowerCase()} />
                    )
                  }
                  return <Redirect to="/analytics/overview" />
                }}
              />

            <Route path={`${path}/overview`}>
                <GlobalPage />
              </Route>

              <Route path={`${path}/tokens`}>
                <AllTokensPage />
              </Route>

            <Route path={`${path}/pairs`}>
                <AllPairsPage />
              </Route>

            <Route path={`${path}/accounts`}>
                <AccountLookup />
              </Route>

          </>
        ) : (
          <LocalLoader fill="true" />
        )}
      </AppWrapper>
  )
}

export default Analytics
