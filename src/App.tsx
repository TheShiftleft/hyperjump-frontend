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
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './views/Swap/AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './views/Swap/RemoveLiquidity/redirects'
// import VortexBridge from './views/Swap/VortexBridge'
import AddLiquidity from './views/Swap/AddLiquidity'
import Pool from './views/Swap/Pool'
import PoolFinder from './views/Swap/PoolFinder'
import RemoveLiquidity from './views/Swap/RemoveLiquidity'
import Swap from './views/Swap/Swap'
import Zap from './views/Zap/Zap'
import Warp from './views/Zap/Warp'
import Lottery from './views/Lottery'
import Unrekt from './views/Tools/Unrekt'

// Route-based code splitting
const Farms = lazy(() => import('./views/Farms'))
const Vaults = lazy(() => import('./views/Vaults'))
const Pools = lazy(() => import('./views/Pools'))
const NotFound = lazy(() => import('./views/NotFound'))
const Migrations = lazy(() => import('./views/Migrations'))
const Bridge = lazy(() => import('./views/Bridge'))
const OnRamp = lazy(() => import('./views/OnRamp'))
const MtPelerin = lazy(() => import('./views/MtPelerin'))
const VortexBridge = lazy(() => import('./views/Swap/VortexBridge'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  usePollCoreFarmData()

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
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/zap" component={Zap} />
            <Route exact strict path="/warp" component={Warp} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact path="/bridge" component={VortexBridge} />
            <Route exact path="/pool" component={Pool} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact strict path="/unrekt" component={Unrekt} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
            {/* Redirection: These old routes are still used in the code base */}
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route path="/onramp">
              <OnRamp />
            </Route>
            <Route path="/mtpelerin">
              <MtPelerin />
            </Route>
            <Route path="/lottery">
              <Lottery />
            </Route>
            <Route path="/migrations">
              <Migrations />
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

            {/* Redirect
             */}
            <Route path="/staking">
              <Redirect to="/pools" />
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
