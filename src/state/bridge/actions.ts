import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string, chainId: string }>('bridge/selectCurrency')
export const switchCurrencies = createAction<void>('bridge/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('bridge/typeInput')
export const replaceBridgeState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
  outputChainId: string | null
}>('bridge/replaceBridgeState')
export const setRecipient = createAction<{ recipient: string | null }>('bridge/setRecipient')

export const selectNetwork = createAction<{ field: Field; chainId: number }>('bridge/selectNetwork')
export const selectBridgeCurrency = createAction<{ field: Field; currencyId: string }>('bridge/selectBridgeCurrency')
