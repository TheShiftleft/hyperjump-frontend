import BigNumber from 'bignumber.js'
import { Currency, CurrencyAmount, JSBI, Token, TokenAmount } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import getNetwork from 'utils/getNetwork'
import ERC20_INTERFACE from '../../config/abi/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useSwapMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData, useMultiChainContractSingleData } from '../multicall/hooksMultilChain'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount | undefined
} {
  const multicallContract = useSwapMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses],
  )

  const { config, chainId } = getNetwork()

  const results = useSingleContractMultipleData(
    chainId,
    multicallContract,
    'getEthBalance',
    addresses.map((address) => [address]),
  )
  

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = config.baseCurrencyAmount(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, config, results],
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens],
  )

  const multChainId = (tokens ?? undefined ? tokens[0].chainId : undefined)

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
  const new_balances = useMultiChainContractSingleData(multChainId, validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])
  console.log("new_balances", new_balances[0])
  const balances = useMultipleContractSingleData(multChainId, validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])
  console.log(multChainId, balances)
  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined

              
              console.log(new_balances)
              const nb = new_balances[0];
              
              nb[0].then((b) => {
                const amount11 = b ?? undefined ? JSBI.BigInt(b.toString()) : undefined
                memo[token.address] = new TokenAmount(token, amount11)
                console.log("bbbb",memo[token.address])
                
              })

              return memo
            }, {})
          : {},
      [address, validatedTokens, balances, new_balances],
    ),
    anyLoading,
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[],
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [],
    [currencies],
  )
  const { config } = getNetwork()

  const tokenBalances = useTokenBalances(account, tokens)
  console.log("tokenBalances", tokenBalances)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency === config.baseCurrency) ?? false, [config.baseCurrency, currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === config.baseCurrency) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, config.baseCurrency, currencies, ethBalance, tokenBalances],
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}
