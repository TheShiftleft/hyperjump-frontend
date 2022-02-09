import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const replaceZapState = createAction<{
    inputCurrencyId: string
    outputCurrencyId: string
  }>('zap/replaceZapState')