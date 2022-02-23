import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('warp/selectCurrency')
export const selectPair = createAction<{field: Field; pairId: string}>('warp/selectPair')
export const typeInput = createAction<{ field: Field; typedValue: string }>('warp/typeInput')
export const replaceWarpState = createAction<{
    field: Field
    typedValue: string
    inputPairId: string
    outputCurrencyId: string
  }>('warp/replaceWarpState')