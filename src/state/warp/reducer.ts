import { createReducer, createSlice } from '@reduxjs/toolkit'
import { Field, replaceWarpState, typeInput, selectCurrency, selectPair } from './actions'

export interface WarpState {
	readonly field: Field
	readonly typedValue: string
	readonly [Field.INPUT] : {
			readonly pairId: string | undefined

	}
	readonly [Field.OUTPUT] : {
			readonly currencyId: string | undefined
	}
}

const warpInitialState: WarpState = {
	field: Field.INPUT,
	typedValue: '',
	[Field.INPUT]: {
			pairId: ''
	},
	[Field.OUTPUT]: {
			currencyId: ''
	}
}

export default createReducer<WarpState>(warpInitialState, (builder) => 
	builder
		.addCase(
			replaceWarpState,
			(state, { payload: { field, typedValue, inputPairId, outputCurrencyId } }) => {
				return {
					[Field.INPUT]: {
						pairId: inputPairId,
					},
					[Field.OUTPUT]: {
						currencyId: outputCurrencyId,
					},
					field,
					typedValue
				}
			}
		)
		.addCase(
			typeInput,
			(state, {payload: {field, typedValue}}) => {
				return {
					...state,
					field,
					typedValue
				}
			}
		)
		.addCase(
			selectPair,
			(state, {payload: {field, pairId}}) => {
				return {
					...state,
					[field]: {pairId}
				}
			}
		)
)