import React from 'react'
import ReactDOM from 'react-dom'
import Providers from './Providers'
import ListsUpdater from './state/lists/updater'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ToastListener from './components/ToastListener'
// import { Updater as LocalStorageContextUpdater } from './contexts/Analytics/LocalStorage'
// import { Updater as TokenDataContextUpdater } from './contexts/Analytics/TokenData'
// import { Updater as PairDataContextUpdater } from './contexts/Analytics/PairData'
import App from './App'

/* 
function AnalyticsUpdaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <PairDataContextUpdater />
      <TokenDataContextUpdater />
    </>
  )
}
 */

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        {/* <AnalyticsUpdaters /> */}
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
        <ToastListener />
      </>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
