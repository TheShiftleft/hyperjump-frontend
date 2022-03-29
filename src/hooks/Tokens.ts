import { parseBytes32String } from '@ethersproject/strings'
import { Currency, Token, currencyEquals, ChainId } from '@hyperjump-defi/sdk'
import { useMemo } from 'react'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import getNetwork from 'utils/getNetwork'
import bridgeNetworks from 'config/constants/bridgeNetworks'
import { BridgeNetwork } from 'components/NetworkSelectionModal/types'
import { useSelectedTokenList, TokenAddressMap, WrappedTokenInfo} from '../state/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
// eslint-disable-next-line import/no-cycle
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract, useMultiChainContract, useMultiChainContractBytes32 } from './useContract'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.BSC_TESTNET]: {},
  [ChainId.BSC_MAINNET]: {},
  [ChainId.FTM_MAINNET]: {},
  [ChainId.FTM_TESTNET]: {},
}

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find((token) => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address || undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address || undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

export function useSelectedBridgeNetwork(outputChainId: number) {
  return useMemo(() => {
      // Override Default TO Bridge Network based on config
      let selectedKey = "0";
      Object.keys(bridgeNetworks)
        .forEach(function eachKey(key) { 
          if(bridgeNetworks[key].chainId === outputChainId)
              selectedKey= key
          
        });
      return bridgeNetworks[selectedKey];
  },[outputChainId])
}

export function useBridgeTokens(selectedBridgeNetwork: BridgeNetwork) {
  return useMemo(() => { 
    const list: TokenList = selectedBridgeNetwork;
    if(list == null) return [];
    
    const map = list.tokens.reduce<TokenAddressMap>(
      (tokenMap, tokenInfo) => {
        const tags: TagInfo[] =
          tokenInfo.tags
            ?.map((tagId) => {
              if (!list.tags?.[tagId]) return undefined
              return { ...list.tags[tagId], id: tagId }
            })
            ?.filter((x): x is TagInfo => Boolean(x)) ?? []
        const token = new WrappedTokenInfo(tokenInfo, tags)
        
        return {
          ...tokenMap,
          [token.chainId]: {
            ...tokenMap[token.chainId],
            [token.address]: token,
          },
        }
      },
      { ...EMPTY_LIST },
    )

    return [map[selectedBridgeNetwork.chainId]]
  }, [selectedBridgeNetwork])
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useTokenOnOtherChain(tokenAddress?: string, outputChainId?: string): Token | undefined | null {
  const {chainId} = useActiveWeb3React()

  const selectedBridgeNetwork = useSelectedBridgeNetwork(parseInt(outputChainId))
  const _networkTokens = useBridgeTokens(selectedBridgeNetwork)
  const toChain = parseInt(outputChainId)

  const tokens = useMemo(() => {
    return _networkTokens[0]
  }, [_networkTokens])

  const address = isAddress(tokenAddress)

  const tokenContract = useMultiChainContract(address || undefined, toChain)
  const tokenContractBytes32 = useMultiChainContractBytes32(address || undefined, toChain)
  const token: Token | undefined = address ? tokens[address] : undefined
  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)

  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )

  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!toChain || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        toChain,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    toChain,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const { config } = getNetwork()
  const isNetworkToken = currencyId?.toUpperCase() === config.networkToken.symbol
  const token = useToken(isNetworkToken ? undefined : currencyId)
  return isNetworkToken ? config.baseCurrency : token
}

export function useCurrencyOnOtherChain(currencyId: string | undefined, outputChainId: string | undefined): Currency | null | undefined {
  const token = useTokenOnOtherChain(currencyId, outputChainId)
  return token
}

