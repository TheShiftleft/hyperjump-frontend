import { createReducer, createSlice } from '@reduxjs/toolkit'
import { Field, replaceZapState } from './actions'

export interface ZapState {
	readonly [Field.INPUT] : {
			readonly currencyId: string | undefined

	}
	readonly [Field.OUTPUT] : {
			readonly currencyId: string | undefined
	}
}

const zapInitialState: ZapState = {
	[Field.INPUT]: {
			currencyId: ''
	},
	[Field.OUTPUT]: {
			currencyId: ''
	}
}

export default createReducer<ZapState>(zapInitialState, (builder) => 
	builder
		.addCase(
			replaceZapState,
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