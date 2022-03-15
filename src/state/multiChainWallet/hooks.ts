import { Currency, CurrencyAmount, JSBI, Token, TokenAmount } from '@hyperjump-defi/sdk'
import { useMemo, useState } from 'react'
import getNetwork from 'utils/getNetwork'
import ERC20_INTERFACE from '../../config/abi/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useSwapMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultiChainContractSingleData } from '../multicall/hooksMultilChain'

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
  const { chainId } = getNetwork()
  const multChainId = (tokens ?? undefined ? tokens[0]?.chainId : chainId)

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
  const new_balances = useMultiChainContractSingleData(multChainId, validatedTokenAddresses, ERC20_INTERFACE, (address ?? undefined ? [address] : undefined))
  const [amount, setAmount] = useState(JSBI.BigInt(0))
  new_balances[0]?.then((b) => {
    const v = b?.[0]
    setAmount((v ? JSBI.BigInt(v.toString()) : undefined))
  })

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return (memo ?? undefined ? memo : undefined)
            }, {})
          : {},
      [address, validatedTokens, amount],
    ),
    undefined,
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
