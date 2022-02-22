import { createReducer, createSlice } from '@reduxjs/toolkit'
import { Pair } from '@hyperjump-defi/sdk'
import { Field, replaceZapState, typeInput, selectCurrency, selectPair } from './actions'

export interface ZapState {
	readonly field: Field
  	readonly typedValue: string
	readonly [Field.INPUT] : {
			readonly currencyId: string | undefined

	}
	readonly [Field.OUTPUT] : {
			readonly pairId: string | undefined
	}
}

const zapInitialState: ZapState = {
	field: Field.INPUT,
  	typedValue: '',
	[Field.INPUT]: {
			currencyId: ''
	},
	[Field.OUTPUT]: {
			pairId: ''
	}
}

export default createReducer<ZapState>(zapInitialState, (builder) => 
	builder
		.addCase(
			replaceZapState,
			(state, { payload: { typedValue, field, inputCurrencyId, outputPairId } }) => {
				return {
					[Field.INPUT]: {
						currencyId: inputCurrencyId,
					},
					[Field.OUTPUT]: {
						pairId: outputPairId,
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
			selectCurrency,
			(state, {payload: {field, currencyId }}) => {
				return {
					...state,
					[field]: {currencyId}
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