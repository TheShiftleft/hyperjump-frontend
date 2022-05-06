import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, BNB, FANTOM, JSBI, Token, TokenAmount, Trade } from '@hyperjump-defi/sdk'
import ChainId from 'utils/getChain'
import { Redirect, Route } from 'react-router'
import { useHistory } from 'react-router-dom'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getNetwork from 'utils/getNetwork'
import bridgeNetworks from 'config/constants/bridgeNetworks'
import { BridgeNetwork } from 'components/NetworkSelectionModal/types'
import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useCurrencyOnOtherChain } from '../../hooks/Tokens'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import {
  Field,
  replaceBridgeState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
  selectNetwork,
  selectBridgeCurrency,
} from './actions'
import { BridgeState } from './reducer'

import { useUserSlippageTolerance } from '../user/hooks'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'

function assignToken(token) {
  return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name)
}

function findBridgeToken(bridgeNetwork: BridgeNetwork, swapType: string) {
  return bridgeNetwork.tokens
    .map((t) => {
      const bSwapType = bridgeNetwork.swappablePools[t.symbol]
      return bSwapType === swapType ? t : undefined
    })
    .filter((r) => r)
}

export function useBridgeState(): AppState['bridge'] {
  return useSelector<AppState, AppState['bridge']>((state) => state.bridge)
}

export function checkCanBridgeByNetwork(fromBridgeNetwork: BridgeNetwork, toBridgeNetwork: BridgeNetwork) {
  let fromCurrency: Token
  let toCurrency: Token
  let bSymbol: string

  if (toBridgeNetwork.chainId === ChainId.BSC_MAINNET || toBridgeNetwork.chainId === ChainId.FTM_MAINNET) {
    bSymbol = 'JUMP'
  } else if (toBridgeNetwork.chainId === ChainId.MOONRIVER) {
    bSymbol = 'SYN'
  } else {
    bSymbol = 'USDC'
  }

  for (let i = 0; i < fromBridgeNetwork.tokens.length; i++) {
    if (bSymbol === fromBridgeNetwork.tokens[i].symbol) {
      fromCurrency = assignToken(fromBridgeNetwork.tokens[i])
      break
    }
  }
  for (let i = 0; i < toBridgeNetwork.tokens.length; i++) {
    if (bSymbol === toBridgeNetwork.tokens[i].symbol) {
      toCurrency = assignToken(toBridgeNetwork.tokens[i])
      break
    }
  }

  return [fromCurrency, toCurrency]
}

export function useBridgeNetworkActionHandlers(): {
  onNetworkSelection: (field: Field, bridgeNetwork: BridgeNetwork, otherBridgeNetwork: BridgeNetwork) => void
  onSwitchNetworks: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const onNetworkSelection = useCallback(
    (field: Field, bridgeNetwork: BridgeNetwork, otherBridgeNetwork: BridgeNetwork) => {
      let fromBridgeNetwork: BridgeNetwork
      let toBridgeNetwork: BridgeNetwork

      if (field === Field.OUTPUT) {
        fromBridgeNetwork = otherBridgeNetwork
        toBridgeNetwork = bridgeNetwork

        const [fromCurrency, toCurrency] = checkCanBridgeByNetwork(fromBridgeNetwork, toBridgeNetwork)

        dispatch(
          replaceBridgeState({
            typedValue: '',
            field: field.toString() === Field.INPUT ? Field.INPUT : Field.OUTPUT,
            inputCurrencyId: fromCurrency instanceof Token ? fromCurrency.address : undefined,
            outputCurrencyId: toCurrency instanceof Token ? toCurrency.address : undefined,
            recipient: '',
            outputChainId: toCurrency instanceof Token ? toCurrency.chainId.toString() : '56',
          }),
        )
        history.push(
          `/bridge?outputChainId=${toBridgeNetwork.chainId}&inputCurrency=${fromCurrency.address}&outputCurrency=${toCurrency.address}`,
        )
      }

      dispatch(
        selectNetwork({
          field,
          chainId: bridgeNetwork.chainId,
        }),
      )
    },
    [dispatch, history],
  )

  const onSwitchNetworks = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  return {
    onSwitchNetworks,
    onNetworkSelection,
  }
}

export function checkCanBridgeByCurrency(inputCurrency: Currency, outputCurrency: Currency, field: Field) {
  let fromBridgeNetwork: BridgeNetwork
  let toBridgeNetwork: BridgeNetwork
  let ftmBridgeNetwork: BridgeNetwork
  let bscBridgeNetwork: BridgeNetwork
  let ethBridgeNetwork: BridgeNetwork

  if (!inputCurrency || !outputCurrency) return [undefined, undefined]

  // Put aside all network object that can be use later
  Object.keys(bridgeNetworks).forEach(function eachKey(key) {
    if (inputCurrency?.chainId === bridgeNetworks[key]?.chainId) fromBridgeNetwork = bridgeNetworks[key]

    if (outputCurrency?.chainId === bridgeNetworks[key]?.chainId) toBridgeNetwork = bridgeNetworks[key]

    if (ChainId.FTM_MAINNET === bridgeNetworks[key]?.chainId) ftmBridgeNetwork = bridgeNetworks[key]

    if (ChainId.BSC_MAINNET === bridgeNetworks[key]?.chainId) bscBridgeNetwork = bridgeNetworks[key]

    if (ChainId.ETH === bridgeNetworks[key]?.chainId) ethBridgeNetwork = bridgeNetworks[key]
  })

  if (inputCurrency.symbol === outputCurrency.symbol) return [inputCurrency, outputCurrency, undefined]

  const fromSwapType = fromBridgeNetwork.swappablePools[inputCurrency.symbol]
  const toSwapType = toBridgeNetwork.swappablePools[outputCurrency.symbol]

  if (fromSwapType !== toSwapType) {
    if (field === Field.OUTPUT) {
      // On FTM, DOG and HIGH is not supported, use the default instead
      if ((toSwapType === 'DOG' || toSwapType === 'HIGH') && fromBridgeNetwork.chainId === ChainId.FTM_MAINNET) {
        let bToken = findBridgeToken(toBridgeNetwork, fromSwapType)
        outputCurrency = assignToken(bToken[0])
        return [inputCurrency, outputCurrency, toBridgeNetwork]
      }

      // On BSC, ETH is not supported, use the default instead
      if (toSwapType === 'ETH' && fromBridgeNetwork.chainId === ChainId.BSC_MAINNET) {
        let bToken = findBridgeToken(toBridgeNetwork, fromSwapType)
        outputCurrency = assignToken(bToken[0])
        return [inputCurrency, outputCurrency, toBridgeNetwork]
      }

      let bToken = findBridgeToken(fromBridgeNetwork, toSwapType)
      const exactToken = bToken.find((t) => {
        return t.symbol === outputCurrency.symbol ? t : undefined
      })
      if (exactToken) {
        inputCurrency = assignToken(exactToken)
      } else {
        inputCurrency = assignToken(bToken[0])
      }
    } else {
      // MOONRIVER only have 1 token available that can be bridge
      if (toBridgeNetwork.chainId === ChainId.MOONRIVER && fromSwapType !== 'SYN') {
        let bToken = findBridgeToken(fromBridgeNetwork, toSwapType)
        inputCurrency = assignToken(bToken[0])
        return [inputCurrency, outputCurrency, toBridgeNetwork]
      }
      // Switch From Network base on the swap type below
      if (fromSwapType === 'DOG' || fromSwapType === 'HIGH' || fromSwapType === 'ETH') {
        if (fromBridgeNetwork.chainId === ChainId.BSC_MAINNET && toBridgeNetwork.chainId !== ChainId.ETH) {
          let bToken = findBridgeToken(ethBridgeNetwork, fromSwapType)
          outputCurrency = assignToken(bToken[0])
          return [inputCurrency, outputCurrency, ethBridgeNetwork]
        }

        if (fromBridgeNetwork.chainId === ChainId.FTM_MAINNET && toBridgeNetwork.chainId !== ChainId.ETH) {
          let bToken = findBridgeToken(ethBridgeNetwork, fromSwapType)
          outputCurrency = assignToken(bToken[0])
          return [inputCurrency, outputCurrency, ethBridgeNetwork]
        }
      }
      if (fromSwapType === 'JUMP') {
        if (fromBridgeNetwork.chainId === ChainId.FTM_MAINNET && toBridgeNetwork.chainId !== ChainId.BSC_MAINNET) {
          let bToken = findBridgeToken(bscBridgeNetwork, fromSwapType)
          outputCurrency = assignToken(bToken[0])
          return [inputCurrency, outputCurrency, bscBridgeNetwork]
        }

        if (fromBridgeNetwork.chainId === ChainId.BSC_MAINNET && toBridgeNetwork.chainId !== ChainId.FTM_MAINNET) {
          let bToken = findBridgeToken(ftmBridgeNetwork, fromSwapType)
          outputCurrency = assignToken(bToken[0])
          return [inputCurrency, outputCurrency, ftmBridgeNetwork]
        }
      }

      let bToken = findBridgeToken(toBridgeNetwork, fromSwapType)
      const exactToken = bToken.find((t) => {
        return t.symbol === inputCurrency.symbol ? t : undefined
      })
      if (exactToken) {
        outputCurrency = assignToken(exactToken)
      } else {
        outputCurrency = assignToken(bToken[0])
      }
    }
  }

  return [inputCurrency, outputCurrency, toBridgeNetwork]
}

export function useBridgeActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    outputChainId,
  } = useBridgeState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrencyOnOtherChain(outputCurrencyId, outputChainId)

  const currencies = useMemo(() => {
    return {
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }
  }, [inputCurrency, outputCurrency])

  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      let _inputCurrency: Currency
      let _outputCurrency: Currency

      if (field === Field.INPUT) {
        _inputCurrency = currency
        _outputCurrency = currencies[Field.OUTPUT]
      } else {
        _inputCurrency = currencies[Field.INPUT]
        _outputCurrency = currency
      }

      const [validInputCurrency, validOutputCurrency, redirectToBridgeNetwork] = checkCanBridgeByCurrency(
        _inputCurrency,
        _outputCurrency,
        field,
      )

      if (redirectToBridgeNetwork) {
        dispatch(
          replaceBridgeState({
            typedValue: '',
            field: field.toString() === Field.INPUT ? Field.INPUT : Field.OUTPUT,
            inputCurrencyId: validInputCurrency instanceof Token ? validInputCurrency.address : undefined,
            outputCurrencyId: validOutputCurrency instanceof Token ? validOutputCurrency.address : undefined,
            recipient: '',
            outputChainId: validOutputCurrency instanceof Token ? validOutputCurrency.chainId.toString() : '56',
          }),
        )

        dispatch(
          selectNetwork({
            field: field.toString() === Field.INPUT ? Field.INPUT : Field.OUTPUT,
            chainId: redirectToBridgeNetwork.chainId,
          }),
        )

        history.push(
          `/bridge?outputChainId=${redirectToBridgeNetwork.chainId}&inputCurrency=${validInputCurrency.address}&outputCurrency=${validOutputCurrency.address}`,
        )
      }

      dispatch(
        selectCurrency({
          field: Field.INPUT,
          currencyId: validInputCurrency instanceof Token ? validInputCurrency.address : '',
          chainId: validInputCurrency instanceof Token ? validInputCurrency.chainId.toString() : '56',
        }),
      )
      dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: validOutputCurrency instanceof Token ? validOutputCurrency.address : '',
          chainId: validOutputCurrency instanceof Token ? validOutputCurrency.chainId.toString() : '56',
        }),
      )
    },
    [dispatch, currencies, history],
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch],
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  const { config } = getNetwork()
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : config.baseCurrencyAmount(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.info(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0xBCfCcbde45cE874adCB698cC183deBcF17952812', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F', // v2 router 02
]

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
  )
}

// from the current bridge inputs, compute the best trade and return it.
export function useDerivedBridgeInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  inputError?: string
} {
  const { account } = useActiveWeb3React()
  const { chainId } = getNetwork()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
    outputChainId,
  } = useBridgeState()
  const inputCurrency = useCurrencyOnOtherChain(inputCurrencyId, chainId.toString())
  const outputCurrency = useCurrencyOnOtherChain(outputCurrencyId, outputChainId)
  const recipientLookup = useENS(recipient ?? undefined)

  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!currencies[Field.INPUT]) {
    inputError = inputError ?? 'Select a token'
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], parsedAmount]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = `Insufficient ${amountIn.currency.symbol} balance`
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const { config } = getNetwork()
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === config.networkToken.symbol.toUpperCase()) return config.networkToken.symbol
    if (valid === false) return config.networkToken.symbol
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

function parseChainIdURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseInt(urlParam)) ? urlParam : ''
}

export function queryParametersToBridgeState(parsedQs: ParsedQs): BridgeState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    outputChainId: parseChainIdURLParameter(parsedQs.outputChainId),
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined; outputChainId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined; outputChainId: string | undefined }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToBridgeState(parsedQs)

    dispatch(
      replaceBridgeState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient,
        outputChainId: parsed.outputChainId,
      }),
    )

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
      outputChainId: parsed.outputChainId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}
