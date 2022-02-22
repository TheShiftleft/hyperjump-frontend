import { createAction } from '@reduxjs/toolkit'
import { Pair } from '@hyperjump-defi/sdk'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('zap/selectCurrency')
export const selectPair = createAction<{field: Field; pairId: string}>('zap/selectPair')
export const typeInput = createAction<{ field: Field; typedValue: string }>('zap/typeInput')
export const replaceZapState = createAction<{
    field: Field
    typedValue: string
    inputCurrencyId: string
    outputPairId: string
  }>('zap/replaceZapState')