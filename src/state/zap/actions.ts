import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('zap/typeInput')
export const replaceZapState = createAction<{
    field: Field
    typedValue: string
    inputCurrencyId: string
    outputCurrencyId: string
  }>('zap/replaceZapState')