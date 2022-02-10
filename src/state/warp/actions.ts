import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const replaceWarpState = createAction<{
    inputCurrencyId: string
    outputCurrencyId: string
  }>('warp/replaceWarpState')