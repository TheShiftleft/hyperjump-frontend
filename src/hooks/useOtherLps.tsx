import { Pair, Token } from '@hyperjump-defi/sdk'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { LPToken } from 'components/SearchModal/CurrencyListWarp'
import warpLps from 'config/constants/warpLps'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useRef, useState } from 'react'
import { useTokenBalances } from 'state/wallet/hooks'
import getNetwork from 'utils/getNetwork'
import { PairState, usePairs } from 'data/Reserves'
import zapPairs from 'config/constants/zap'
import { useOtherLPComparator } from 'components/SearchModal/sortingOtherLPs'
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

export function useOtherLpsCurrency(defiName: string): LPToken[] {
    const lps = useOtherLps(defiName)
    const web3 = useWeb3()
    const { config } = getNetwork()
    const pairs = zapPairs[config.network]
    const { account } = useActiveWeb3React()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => {
            return lps.map((lp): {liquidityToken: Token, tokens: [Token, Token]} => {
                const dec = new BigNumber(lp.decimals).toString().lastIndexOf('0')
                const lpAddress = web3.utils.toChecksumAddress(lp.address)
                const lp0 = web3.utils.toChecksumAddress(lp.lp0.address)
                const lp1 = web3.utils.toChecksumAddress(lp.lp1.address)
                const p = pairs.find((pair) => {
                    const p0 = web3.utils.toChecksumAddress(pair.quoteToken.address[config.id])
                    const p1 = web3.utils.toChecksumAddress(pair.token.address[config.id])
                    return((p0 === lp0 || p0 === lp1) && (p1 === lp0 || p1 === lp1))
                })
                if(p){
                    const dec0 = p.quoteToken.address[config.id] === lp0 ? Number(lp.lp0.decimals).toLocaleString('fullwide', {useGrouping:false}).lastIndexOf('0') : Number(lp.lp1.decimals).toLocaleString('fullwide', {useGrouping:false}).lastIndexOf('0')
                    const dec1 = p.quoteToken.address[config.id] === lp1 ? Number(lp.lp1.decimals).toLocaleString('fullwide', {useGrouping:false}).lastIndexOf('0') : Number(lp.lp0.decimals).toLocaleString('fullwide', {useGrouping:false}).lastIndexOf('0')
                    const tokens: [Token, Token] = [ new Token(lp?.chainId, web3.utils.toChecksumAddress(p?.token?.address[config.id]), p?.token?.decimals ?? dec0, p?.token?.symbol, p?.token?.symbol),
                                                     new Token(lp?.chainId, web3.utils.toChecksumAddress(p?.quoteToken?.address[config.id]), p?.quoteToken?.decimals ?? dec1, p?.quoteToken?.symbol, p?.quoteToken?.symbol)]
                    const liquidityToken = new Token(lp.chainId, lpAddress, dec, p.lpSymbol, lp.name)
                    return { liquidityToken, tokens }
                }
                return {liquidityToken: undefined, tokens: [undefined, undefined]}
            }).filter(data => (data.liquidityToken !== undefined && data.tokens[0] !== undefined && data.tokens[1] !== undefined))
        },
        [lps, web3, config, pairs],
    )
    const balances = useTokenBalances(account,tokenPairsWithLiquidityTokens.map(({liquidityToken}) => liquidityToken))
    const otherLpsWithBalance = useMemo(() => {
        return tokenPairsWithLiquidityTokens.map((lp) => {
            return {...lp, balance: balances[lp.liquidityToken.address]}
        })
    }, [balances, tokenPairsWithLiquidityTokens])

    const checkPairs = usePairs(otherLpsWithBalance.map(({tokens}) => tokens))
    const validPairs: LPToken[] = checkPairs.map((checkPair, index) => checkPair[0] === PairState.EXISTS ? otherLpsWithBalance[index] : undefined).filter(value => value !== undefined)
    const lpComparator = useOtherLPComparator(false)
    const sorted = validPairs.sort(lpComparator)
    return sorted
}