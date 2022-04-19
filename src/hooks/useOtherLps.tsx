import { Token } from '@hyperjump-defi/sdk'
import axios from 'axios'
import { LPToken } from 'components/SearchModal/CurrencyListWarp'
import warpLps from 'config/constants/warpLps'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useRef, useState } from 'react'
import { useTokenBalances } from 'state/wallet/hooks'
import getNetwork from 'utils/getNetwork'
import zapPairs from 'config/constants/zap'
import { useOtherLPComparator } from 'components/SearchModal/sortingOtherLPs'
import { toNumber } from 'lodash'
import { isAddress } from 'utils'
import useWeb3 from './useWeb3'

export default function useOtherLps(defiName: string) {
    const cache = useRef({})
    const { config } = getNetwork()
    const otherLPs = warpLps[config.network]
    const [Lps, setLps] = useState([])
    useMemo(() => {
        const fetchData = async () => {
            if(defiName){
                const response = await axios(otherLPs[defiName].url)
                cache.current[otherLPs[defiName].name] = response.data
                setLps(response.data)
            }
        }
        fetchData()
    },[otherLPs, defiName])
    return Lps
}

export function useFilterLpAvailableToHyper(defiName: string) {
    const lps = useOtherLps(defiName)
    const web3 = useWeb3()
    const { config } = getNetwork()
    const pairs = zapPairs[config.network]
    return useMemo(() => {
        return pairs.map(pair => {
            const pair0 = web3.utils.toChecksumAddress(pair.token.address[config.id])
            const pair1 = web3.utils.toChecksumAddress(pair.quoteToken.address[config.id])
            return lps.find(lp => {
                const lp0 = web3.utils.toChecksumAddress(lp.lp0.address)
                const lp1 = web3.utils.toChecksumAddress(lp.lp1.address)
                return ((pair0 === lp0 || pair0 === lp1) && (pair1 === lp0 || pair1 === lp1))
            })
        }).filter(data => data !== undefined)
    },[lps, web3, config, pairs])
}

export function useOtherLpsCurrency(defiName: string): LPToken[] {
    const web3 = useWeb3()
    const { config, chainId } = getNetwork()
    const filtered = useFilterLpAvailableToHyper(defiName)
    const pairs = zapPairs[config.network]
    const tokenPairsWithLiquidityTokens = useMemo(
        () => {
            return filtered.map((lp): {liquidityToken: Token, tokens: [Token, Token]} => {
                const dec = toNumber(lp?.decimals.toLowerCase().split('e').pop())
                const lpAddress = web3.utils.toChecksumAddress(lp.address)
                const pairToken = Object.values(pairs).find(val => {
                    const valAddress0 = isAddress(val.token.address[chainId])
                    const valAddress1 = isAddress(val.quoteToken.address[chainId])
                    const lpAddress0 = isAddress(lp?.lp0.address)
                    const lpAddress1 = isAddress(lp?.lp1.address)
                    return valAddress0 && valAddress1 && lpAddress0 && lpAddress1 && (valAddress0 === lpAddress0 || valAddress0 === lpAddress1) && (valAddress1 === lpAddress0 || valAddress1 === lpAddress1)
                  })
                const tokens: [Token, Token] = [
                    new Token(chainId, pairToken.token.address[chainId], pairToken.token.decimals, pairToken.token.symbol, pairToken.token.symbol),
                    new Token(chainId,pairToken.quoteToken.address[chainId], pairToken.quoteToken.decimals, pairToken.quoteToken.symbol, pairToken.quoteToken.symbol),
                ]
                const liquidityToken = new Token(lp.chainId, lpAddress, dec, pairToken.lpSymbol, lp.name)
                return { liquidityToken, tokens }
            })
        },
        [web3, filtered, chainId, pairs],
    )
    const lpComparator = useOtherLPComparator(false)
    const sorted = tokenPairsWithLiquidityTokens.sort(lpComparator)
    return sorted
}

export function useLpBalances(lps: {liquidityToken: Token, tokens: [Token, Token]}[]) {
    const { account } = useActiveWeb3React()
    const balances =  useTokenBalances(account, lps.map(({liquidityToken}) => liquidityToken))
    return useMemo(() => {
            return lps.map((lp) => {
                return {...lp, balance: balances[lp.liquidityToken.address]}
            })
        }, [balances, lps])
    
}