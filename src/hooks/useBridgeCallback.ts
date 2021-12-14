import { BigNumber as EthBigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Currency, Token, ChainId } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import { BridgeNetwork } from 'components/NetworkSelectionModal/types'
import { useSynapseBridgeContract } from './useContract'
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
): { state: BridgeCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId: fromChainId } = useActiveWeb3React()

  const toChainId = (toBridgeNetwork ?? undefined ? toBridgeNetwork.chainId : undefined)

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const synapseBridgeContract = useSynapseBridgeContract()

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

    return {
      state: BridgeCallbackState.VALID,
      callback: async function onBridge(): Promise<string> {
        const validFromToken = isAddress(fromToken instanceof Token
            ? fromToken.address
            : undefined)
        const validToToken = isAddress(toToken instanceof Token
            ? toToken.address
            : undefined)

        console.log("DDBUG1", account)
        console.log("DDBUG2", toChainId)
        console.log("DDBUG3", validFromToken)
        console.log("DDBUG4", validToToken)
        console.log("DDBUG5", EthBigNumber.from(currencyAmountFrom.raw.toString()))
        
        
        const txhash = (toChainId === ChainId.FTM_MAINNET ? synapseBridgeContract.methods
          .redeem(account, toChainId, validFromToken, EthBigNumber.from(currencyAmountFrom.raw.toString()))
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          }) : toChainId === ChainId.BSC_MAINNET ? synapseBridgeContract.methods
          .deposit(account, toChainId, validFromToken, EthBigNumber.from(currencyAmountFrom.raw.toString()))
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          }) : undefined) 
        
        console.log("DDBUG6", txhash)
        return txhash;
      },
      error: null
    }

  }, [synapseBridgeContract,  currencyAmountFrom, account, fromChainId, toChainId, fromToken, toToken, recipient, recipientAddressOrName])
}


export default useBridgeCallback
