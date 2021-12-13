import { BigNumber as EthBigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType, CurrencyAmount, Currency, Token, TokenAmount } from '@hyperjump-defi/sdk'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useMemo } from 'react'
import { BridgeNetwork } from 'components/NetworkSelectionModal/types'
import { useSynapseBridgeContract } from './useContract'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../state/multicall_bridge/hooks'
import { BIPS_BASE, DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, DEFAULT_TOKEN_DECIMAL } from '../config'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getRouterContract, isAddress, shortenAddress } from '../utils'
import isZero from '../utils/isZero'
import { useActiveWeb3React } from './index'
import useENS from './useENS'

enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: EthBigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId) return []

    const contract: Contract | null = getRouterContract(library, account)
    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      // @ts-ignore
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(Math.floor(allowedSlippage)), BIPS_BASE),
        recipient,
        ttl: deadline,
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        // @ts-ignore
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(Math.floor(allowedSlippage)), BIPS_BASE),
          recipient,
          ttl: deadline,
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useBridgeCallback(
  currencyAmountFrom: CurrencyAmount | undefined, // Amount of INPUT TOKEN to execute, required
  toBridgeNetwork: BridgeNetwork | undefined,
  fromToken: Currency | undefined,
  toToken: Currency | undefined,
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId: fromChainId } = useActiveWeb3React()

  const toChainId = (toBridgeNetwork ?? undefined ? toBridgeNetwork.chainId : undefined)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const synapseBridgeContract = useSynapseBridgeContract()

  return useMemo(() => {
    if (!currencyAmountFrom || !fromToken || !toToken || !account || !fromChainId || !toChainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onBridge(): Promise<string> {
        const validFromToken = isAddress(fromToken instanceof Token
            ? fromToken.address
            : undefined)
        const validToToken = isAddress(toToken instanceof Token
            ? toToken.address
            : undefined)

         return synapseBridgeContract.methods
          .deposit(account, toChainId, validFromToken, EthBigNumber.from(currencyAmountFrom.raw.toString()))
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          });
      },
      error: null
    }
    return { state: SwapCallbackState.INVALID, callback: null, error: 'HEEERE' }
  }, [synapseBridgeContract,  currencyAmountFrom, account, fromChainId, toChainId, fromToken, toToken, recipient, recipientAddressOrName])
}


export default useBridgeCallback
