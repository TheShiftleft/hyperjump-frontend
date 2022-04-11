import { createReducer } from '@reduxjs/toolkit'
import { Field, replaceWarpState, typeInput, selectLP, selectSwap } from './actions'

export interface WarpState {
	readonly field: Field
	readonly typedValue: string
	readonly selectedSwap: string
	readonly [Field.INPUT] : {
			readonly lpId: string | undefined

	}
	readonly [Field.OUTPUT] : {
			readonly currencyId: string | undefined
	}
}

const warpInitialState: WarpState = {
	field: Field.INPUT,
	typedValue: '',
	selectedSwap: '',
	[Field.INPUT]: {
			lpId: ''
	},
	[Field.OUTPUT]: {
			currencyId: ''
	}
}

export default createReducer<WarpState>(warpInitialState, (builder) => 
	builder
		.addCase(
			replaceWarpState,
			(state, { payload: { field, typedValue, inputLpId, outputCurrencyId, swapId } }) => {
				return {
					[Field.INPUT]: {
						lpId: inputLpId,
					},
					[Field.OUTPUT]: {
						currencyId: outputCurrencyId,
					},
					field,
					typedValue,
					selectedSwap: swapId
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
			selectLP,
			(state, {payload: {field, lpId}}) => {
				return {
					...state,
					[field]: {
						lpId
					}
				}
			}
		)
		.addCase(
			selectSwap,
			(state, {payload: {swapId}}) => {
				return {
					...state,
					selectedSwap: swapId
				}
			}
		)
)