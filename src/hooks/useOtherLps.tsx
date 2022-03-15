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
            const pair0 = web3.utils.toChecksumAddress(pair.quoteToken.address[config.id])
            const pair1 = web3.utils.toChecksumAddress(pair.token.address[config.id])
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
    const filtered = useFilterLpAvailableToHyper(defiName)
    const tokenPairsWithLiquidityTokens = useMemo(
        () => {
            return filtered.map((lp): {liquidityToken: Token, tokens: [Token, Token]} => {
                const dec = toNumber(lp?.decimals.toLowerCase().split('e').pop())
                const lpAddress = web3.utils.toChecksumAddress(lp.address)
                const symbol = `${lp?.lp0?.oracleId.toLowerCase() === 'wbnb' ? 'BNB' : lp?.lp0?.oracleId.toLowerCase() === 'wftm' ? 'FTM' : lp?.lp0?.oracleId}-
                                ${lp?.lp1?.oracleId.toLowerCase() === 'wbnb' ? 'BNB' : lp?.lp1?.oracleId.toLowerCase() === 'wftm' ? 'FTM' : lp?.lp1?.oracleId}`
                const tokens: [Token, Token] = [ new Token(lp?.chainId, web3.utils.toChecksumAddress(lp?.lp0?.address), toNumber(lp?.lp0?.decimals.toLowerCase().split('e').pop()), lp?.lp0?.oracleId, lp?.lp0?.oracleId),
                                                    new Token(lp?.chainId, web3.utils.toChecksumAddress(lp?.lp1?.address), toNumber(lp?.lp1?.decimals.toLowerCase().split('e').pop()), lp?.lp1?.oracleId, lp?.lp1?.oracleId)]
                const liquidityToken = new Token(lp.chainId, lpAddress, dec, symbol, lp.name)
                return { liquidityToken, tokens }
            })
        },
        [web3, filtered],
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