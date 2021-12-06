import React, { lazy } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollCoreFarmData, usePollBlockNumber } from 'state/hooks'
import GlobalStyle from './style/Global'
import HorizontalMenu from './components/HorizontalMenu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import Home from './views/Home'
import Missions from './views/Missions'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './views/Swap/AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './views/Swap/RemoveLiquidity/redirects'
import AddLiquidity from './views/Swap/AddLiquidity'
import Pool from './views/Swap/Pool'
import PoolFinder from './views/Swap/PoolFinder'
import RemoveLiquidity from './views/Swap/RemoveLiquidity'
import Swap from './views/Swap/Swap'
import Lottery from './views/Lottery'

import DefaultNetwork from './utils/getNetwork'

// Route-based code splitting
const Farms = lazy(() => import('./views/Farms'))
const Vaults = lazy(() => import('./views/Vaults'))
const Pools = lazy(() => import('./views/Pools'))
const NotFound = lazy(() => import('./views/NotFound'))
const Analytics = lazy(() => import('./views/Analytics'))
const Convert = lazy(() => import('./views/Convert/Convert'))
const Bridge = lazy(() => import('./views/Bridge'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  usePollCoreFarmData()

  const configDefault = DefaultNetwork()
  const defaultInputCurr = configDefault.config.networkToken.symbol
  const defaultOutputCurr = configDefault.config.networkToken.symbol === 'FTM' ? configDefault.config.farmingToken.address[250] : configDefault.config.farmingToken.address[56]

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <HorizontalMenu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>

            <Route exact strict path="/swap" component={Swap} render={() => (
              <Redirect to={`/swap?inputCurrency=${defaultInputCurr}&outputCurrency=${defaultOutputCurr}`}/>
            )}/>

            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact path="/pool" component={Pool} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

            {/* Redirection: These old routes are still used in the code base */}
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />

            <Route path="/lottery">
              <Lottery />
            </Route>
            <Route path="/convert">
              <Convert />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/pools">
              <Pools />
            </Route>
            <Route path="/vaults">
              <Vaults />
            </Route>
            <Route path="/missions">
              <Missions />
            </Route>
            {/* Redirect
             */}
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>

            <Route path="/analytics">
              <Analytics />
            </Route>

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </HorizontalMenu>
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
