import { createReducer, createSlice } from '@reduxjs/toolkit'
import { Field, replaceWarpState } from './actions'

export interface WarpState {
	readonly [Field.INPUT] : {
			readonly currencyId: string | undefined

	}
	readonly [Field.OUTPUT] : {
			readonly currencyId: string | undefined
	}
}

const warpInitialState: WarpState = {
	[Field.INPUT]: {
			currencyId: ''
	},
	[Field.OUTPUT]: {
			currencyId: ''
	}
}

export default createReducer<WarpState>(warpInitialState, (builder) => 
	builder
		.addCase(
			replaceWarpState,
			(state, { payload: { inputCurrencyId, outputCurrencyId } }) => {
				return {
					[Field.INPUT]: {
						currencyId: inputCurrencyId,
					},
					[Field.OUTPUT]: {
						currencyId: outputCurrencyId,
					},
				}
			}
		)
)