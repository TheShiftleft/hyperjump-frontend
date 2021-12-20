import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { save, load } from 'redux-localstorage-simple'
import farmsReducer from './farms'
import poolsReducer from './pools'
import blockReducer from './block'
import lotteryReducer from './lottery'
//  remove to make swap work
// import collectiblesReducer from './collectibles'
import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import toasts from './toasts'
import { getThemeCache } from '../utils/theme'
import vaultsReducer from './vaults'

type MergedState = {
  user: {
    [key: string]: any
  }
  transactions: {
    [key: string]: any
  }
}
const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    block: blockReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    lottery: lotteryReducer,
    // remove to make swap work  predictions: predictionsReducer,
    //  profile: profileReducer,
    //  teams: teamsReducer,
    // remove for swap to work ccollectibles: collectiblesReducer,
    application,
    transactions,
    user,
    swap,
    mint,
    burn,
    multicall,
    lists,
    toasts,
    vaults: vaultsReducer,
  },
  middleware: [...getDefaultMiddleware()],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppState = ReturnType<typeof store.getState>

export default store
