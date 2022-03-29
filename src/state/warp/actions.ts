import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('warp/selectCurrency')
export const selectLP = createAction<{field: Field; lpId: string}>('warp/selectLP')
export const selectSwap = createAction<{swapId: string}>('warp/selectSwap')
export const typeInput = createAction<{ field: Field; typedValue: string }>('warp/typeInput')
export const replaceWarpState = createAction<{
    field: Field
    typedValue: string
    inputLpId: string
    outputCurrencyId: string
    swapId: string
  }>('warp/replaceWarpState')