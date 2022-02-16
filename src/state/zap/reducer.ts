import { createReducer, createSlice } from '@reduxjs/toolkit'
import { Field, replaceZapState, typeInput, selectCurrency } from './actions'

export interface ZapState {
	readonly field: Field
  	readonly typedValue: string
	readonly [Field.INPUT] : {
			readonly currencyId: string | undefined

	}
	readonly [Field.OUTPUT] : {
			readonly currencyId: string | undefined
	}
}

const zapInitialState: ZapState = {
	field: Field.INPUT,
  	typedValue: '',
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
			(state, { payload: { typedValue, field, inputCurrencyId, outputCurrencyId } }) => {
				return {
					[Field.INPUT]: {
						currencyId: inputCurrencyId,
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
			selectCurrency,
			(state, {payload: {field, currencyId }}) => {
				return {
					...state,
					[field]: {currencyId}
				}
			}
		)
)