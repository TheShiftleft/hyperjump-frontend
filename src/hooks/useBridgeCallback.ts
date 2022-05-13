import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { BigNumber as EthBigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Currency, Token } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import ChainId from 'utils/getChain'
import { BridgeNetwork } from 'components/NetworkSelectionModal/types'
import { getGasPriceOptions } from 'utils/callHelpers'
import { useBridgeConfigInstance, useL2BridgeZapContract } from './useContract'
import { isAddress } from '../utils'
import { useActiveWeb3React } from './index'
import useENS from './useENS'

enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

const easyRedeemables = ['SYN', 'HIGH', 'DOG', 'FRAX', 'JUMP', 'WETH']

function getTimeMinutesFromNow(minutesFromNow) {
  const currentTimeSeconds = new Date().getTime() / 1000
  return Math.round(currentTimeSeconds + 60 * minutesFromNow)
}

function tokenIndex(bridgeNetwork, token) {
  return Object.keys(bridgeNetwork.swappablePools).findIndex((t) => token.symbol === t)
}

function getSubstituteToken(bridgeNetwork, symbol) {
  const substituteToken = bridgeNetwork.tokens.filter((t) => t.symbol === symbol)
  return substituteToken[0] ?? undefined ? substituteToken[0].address : undefined
}

// returns a function that will execute a bridge, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useBridgeCallback(
  currencyAmountFrom: CurrencyAmount | undefined, // Amount of INPUT TOKEN to execute, required
  toBridgeNetwork: BridgeNetwork | undefined,
  fromBridgeNetwork: BridgeNetwork | undefined,
  fromToken: Currency | undefined,
  toToken: Currency | undefined,
  recipientAddressOrName: string | null,
): {
  state: BridgeCallbackState
  callback: null | (() => Promise<any>)
  error: string | null
  calculatedBridgeFee?: Promise<string>
} {
  const { account, chainId: fromChainId } = useActiveWeb3React()

  const toChainId = toBridgeNetwork ?? undefined ? toBridgeNetwork.chainId : undefined

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const l2BridgeZapContract = useL2BridgeZapContract()
  const bridgeConfigContract = useBridgeConfigInstance()

  return useMemo(() => {
    if (!currencyAmountFrom || !fromToken || !toToken || !account || !fromChainId || !toChainId) {
      return { state: BridgeCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    const validFromToken = isAddress(fromToken instanceof Token ? fromToken.address : undefined)
    const validToToken = isAddress(toToken instanceof Token ? toToken.address : undefined)

    const subtituteValidFromToken = getSubstituteToken(fromBridgeNetwork, toToken.symbol === 'WETH' ? 'nETH' : 'nUSD')
    const subtituteValidToToken = getSubstituteToken(toBridgeNetwork, 'nUSD')
    const tokenIndexFrom =
      fromToken.symbol === 'BUSD'
        ? tokenIndex(fromBridgeNetwork, fromToken)
        : tokenIndex(fromBridgeNetwork, fromToken) - 1
    const tokenIndexTo = tokenIndex(toBridgeNetwork, toToken)

    const bridgeFeeRequest = bridgeConfigContract.calculateSwapFee(
      easyRedeemables.includes(toToken.symbol) ? validToToken : subtituteValidToToken,
      toChainId,
      EthBigNumber.from(currencyAmountFrom.raw.toString()),
    )
    let bridgeFee = bridgeFeeRequest.then((bf) => {
      const bFee = new BigNumber(bf ?? undefined ? bf.toString() : '0')
      const inputAmount =
        currencyAmountFrom ?? undefined
          ? new BigNumber(currencyAmountFrom.toExact()).multipliedBy(BIG_TEN.pow(18))
          : new BigNumber('0')
      const amountWithFee = inputAmount.minus(bFee)
      const inputDecimals = fromToken?.decimals * -1 > 0 ? fromToken?.decimals * -1 : -18
      return [
        new BigNumber(amountWithFee).shiftedBy(inputDecimals).toPrecision(4),
        parseFloat(new BigNumber(bf.toString()).shiftedBy(inputDecimals).toPrecision(3)).toFixed(2),
      ]
    })

    return {
      calculatedBridgeFee: bridgeFee,
      state: BridgeCallbackState.VALID,
      callback: async function onBridge(): Promise<any> {
        let txhash
        const txDeadline = getTimeMinutesFromNow(10)
        const bridgeTxDeadline = getTimeMinutesFromNow(60 * 24)
        const amountToBridge = EthBigNumber.from(currencyAmountFrom.raw.toString())
        const gasOptions = await getGasPriceOptions()
        switch (toToken.symbol) {
          case 'JUMP':
            txhash =
              toChainId === ChainId.FTM_MAINNET
                ? l2BridgeZapContract.methods
                    .redeem(account, toChainId, validFromToken, amountToBridge)
                    .send({ from: account, ...gasOptions })
                    .on('transactionHash', (tx) => {
                      return tx.transactionHash
                    })
                : toChainId === ChainId.BSC_MAINNET
                ? l2BridgeZapContract.methods
                    .deposit(account, toChainId, validFromToken, amountToBridge)
                    .send({ from: account, ...gasOptions })
                    .on('transactionHash', (tx) => {
                      return tx.transactionHash
                    })
                : undefined
            break
          case 'nUSD':
            if (fromToken.symbol !== 'nUSD') {
              txhash = l2BridgeZapContract.methods
                .swapAndRedeem(
                  account,
                  toChainId,
                  subtituteValidFromToken,
                  tokenIndexFrom,
                  0,
                  amountToBridge,
                  0,
                  txDeadline,
                )
                .send({ from: account, ...gasOptions  })
                .on('transactionHash', (tx) => {
                  return tx.transactionHash
                })
            } else {
              txhash = l2BridgeZapContract.methods
                .redeem(account, toChainId, validFromToken, amountToBridge)
                .send({ from: account, ...gasOptions  })
                .on('transactionHash', (tx) => {
                  return tx.transactionHash
                })
            }
            break
          default:
            if (easyRedeemables.includes(toToken.symbol)) {
              if (toToken.symbol === 'WETH') {
                txhash = l2BridgeZapContract.methods
                  .swapAndRedeemAndSwap(
                    account,
                    toChainId,
                    subtituteValidFromToken,
                    tokenIndexFrom,
                    0,
                    amountToBridge,
                    0,
                    txDeadline,
                    0,
                    tokenIndexTo,
                    0,
                    bridgeTxDeadline,
                  )
                  .send({ from: account, ...gasOptions  })
                  .on('transactionHash', (tx) => {
                    return tx.transactionHash
                  })
              } else {
                txhash = l2BridgeZapContract.methods
                  .redeem(account, toChainId, validFromToken, amountToBridge)
                  .send({ from: account, ...gasOptions  })
                  .on('transactionHash', (tx) => {
                    return tx.transactionHash
                  })
              }
            } else if (toChainId === ChainId.ETH) {
              if (fromToken.symbol === 'nUSD') {
                txhash = l2BridgeZapContract.methods
                  .redeemAndRemove(
                    account,
                    toChainId,
                    subtituteValidFromToken,
                    amountToBridge,
                    tokenIndexTo,
                    0,
                    bridgeTxDeadline,
                  )
                  .send({ from: account, ...gasOptions  })
                  .on('transactionHash', (tx) => {
                    return tx.transactionHash
                  })
              } else {
                txhash = l2BridgeZapContract.methods
                  .swapAndRedeemAndRemove(
                    account,
                    toChainId,
                    subtituteValidFromToken,
                    tokenIndexFrom,
                    0,
                    amountToBridge,
                    0,
                    txDeadline,
                    tokenIndexTo,
                    0,
                    bridgeTxDeadline,
                  )
                  .send({ from: account, ...gasOptions  })
                  .on('transactionHash', (tx) => {
                    return tx.transactionHash
                  })
              }
            } else if (fromToken.symbol === 'nUSD') {
              txhash = l2BridgeZapContract.methods
                .redeemAndSwap(
                  account,
                  toChainId,
                  subtituteValidFromToken,
                  amountToBridge,
                  0,
                  tokenIndexTo,
                  0,
                  txDeadline,
                )
                .send({ from: account, ...gasOptions  })
                .on('transactionHash', (tx) => {
                  return tx.transactionHash
                })
            } else {
              txhash = l2BridgeZapContract.methods
                .swapAndRedeemAndSwap(
                  account,
                  toChainId,
                  subtituteValidFromToken,
                  tokenIndexFrom,
                  0,
                  amountToBridge,
                  0,
                  txDeadline,
                  0,
                  tokenIndexTo,
                  0,
                  bridgeTxDeadline,
                )
                .send({ from: account, ...gasOptions  })
                .on('transactionHash', (tx) => {
                  return tx.transactionHash
                })
            }
        }

        return txhash.then((hash) => {
          return hash
        })
      },
      error: null,
    }
  }, [
    bridgeConfigContract,
    l2BridgeZapContract,
    fromBridgeNetwork,
    toBridgeNetwork,
    currencyAmountFrom,
    account,
    fromChainId,
    toChainId,
    fromToken,
    toToken,
  ])
}

export default useBridgeCallback
