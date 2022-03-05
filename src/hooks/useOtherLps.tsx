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
    const { account } = useActiveWeb3React()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => {
            return lps.map((lp): {liquidityToken: Token, tokens: [Token, Token]} => {
                const dec = new BigNumber(lp.decimals).toString().lastIndexOf('0')
                const dec0 = Number(lp.lp0.decimals).toLocaleString('fullwide', {useGrouping:false}).lastIndexOf('0')
                const dec1 = Number(lp.lp1.decimals).toLocaleString('fullwide', {useGrouping:false}).lastIndexOf('0')
                const tokens: [Token, Token] = [new Token(lp.chainId, lp.lp0.address, dec0 < 0 ? 0 : dec0, lp.lp0.oracleId, lp.lp0.oracleId), new Token(lp.chainId, lp.lp1.address, dec1 < 0 ? 0 : dec1, lp.lp1.oracleId, lp.lp1.oracleId)]
                const liquidityToken = new Token(lp.chainId, lp.address, dec, '', lp.name)
                return { liquidityToken, tokens }
            })
        },
        [lps],
      )
    const balances = useTokenBalances(account,tokenPairsWithLiquidityTokens.map(({liquidityToken}) => liquidityToken))
    const otherLpsWithBalance = useMemo(() => {
        return tokenPairsWithLiquidityTokens.map((lp) => {
            return {...lp, balance: balances[lp.liquidityToken.address]}
        })
    }, [balances, tokenPairsWithLiquidityTokens])

    const checkPairs = usePairs(otherLpsWithBalance.map(({tokens}) => tokens))
    const validPairs: LPToken[] = checkPairs.map((checkPair, index) => checkPair[0] === PairState.EXISTS ? otherLpsWithBalance[index] : undefined).filter(value => value !== undefined)
    return validPairs
}