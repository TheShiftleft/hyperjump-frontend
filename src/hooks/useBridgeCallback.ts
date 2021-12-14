import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { BigNumber as EthBigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Currency, Token, ChainId } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import { BridgeNetwork } from 'components/NetworkSelectionModal/types'
import { useSynapseBridgeContract, useBridgeConfigInstance } from './useContract'
import { isAddress  } from '../utils'
import { useActiveWeb3React } from './index'
import useENS from './useENS'

enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

// returns a function that will execute a bridge, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useBridgeCallback(
  currencyAmountFrom: CurrencyAmount | undefined, // Amount of INPUT TOKEN to execute, required
  toBridgeNetwork: BridgeNetwork | undefined,
  fromToken: Currency | undefined,
  toToken: Currency | undefined,
  recipientAddressOrName: string | null,
): { state: BridgeCallbackState; callback: null | (() => Promise<any>); error: string | null, calculatedBridgeFee?: Promise<string> } {
  const { account, chainId: fromChainId } = useActiveWeb3React()

  const toChainId = (toBridgeNetwork ?? undefined ? toBridgeNetwork.chainId : undefined)

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const synapseBridgeContract = useSynapseBridgeContract()
  const bridgeConfigContract = useBridgeConfigInstance()

  return useMemo(() => {
    if (!currencyAmountFrom || !fromToken || !toToken || !account || !fromChainId || !toChainId) {
      return { state: BridgeCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: BridgeCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: BridgeCallbackState.LOADING, callback: null, error: null }
    }

    const validFromToken = isAddress(fromToken instanceof Token
      ? fromToken.address
      : undefined)
    const validToToken = isAddress(toToken instanceof Token
      ? toToken.address
      : undefined)

    const bridgeFeeRequest = bridgeConfigContract.calculateSwapFee(validToToken, toChainId, EthBigNumber.from(currencyAmountFrom.raw.toString()))
    const bridgeFee = bridgeFeeRequest.then((bf) => {
      const bFee = new BigNumber((bf ?? undefined ? bf.toString() : "0"))
      const inputAmount = (currencyAmountFrom ?? undefined ? new BigNumber(currencyAmountFrom.toExact()).multipliedBy(BIG_TEN.pow(18)) : new BigNumber("0") ) 
      const amountWithFee = inputAmount.minus(bFee).dividedBy(BIG_TEN.pow((fromToken instanceof Token ? fromToken.decimals : 18)));
      return amountWithFee.toString()
    })

    
    return {
      calculatedBridgeFee: bridgeFee,
      state: BridgeCallbackState.VALID,
      callback: async function onBridge(): Promise<any> {      
        const txhash = (toChainId === ChainId.FTM_MAINNET ? synapseBridgeContract.methods
          .redeem(account, toChainId, validFromToken, new BigNumber(currencyAmountFrom.raw.toString()))
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          }) : toChainId === ChainId.BSC_MAINNET ? synapseBridgeContract.methods
          .deposit(account, toChainId, validFromToken, new BigNumber(currencyAmountFrom.raw.toString()))
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          }) : undefined) 

        return txhash.then((hash) => {
          return hash;
        })
        
      },
      error: null
    }

  }, [bridgeConfigContract, synapseBridgeContract, currencyAmountFrom, account, fromChainId, toChainId, fromToken, toToken, recipient, recipientAddressOrName])
}


export default useBridgeCallback
