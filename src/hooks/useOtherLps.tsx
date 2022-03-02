import { Token } from '@hyperjump-defi/sdk'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import warpLps from 'config/constants/warpLps'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toV2LiquidityToken } from 'state/user/hooks'
import getNetwork from 'utils/getNetwork'
import { useToken } from './Tokens'

export default function useOtherLps(defiName: string) {
    const cache = useRef({})
    const { config } = getNetwork()
    const otherLPs = warpLps[config.network]

    const [Lps, setLps] = useState([])
    useMemo(() => {
        const fetchData = async () => {
                const response = await axios(otherLPs[defiName].url)
                cache.current[otherLPs[defiName].name] = response.data
                setLps(response.data)
        }

        fetchData()
    },[otherLPs, defiName])
    
    return Lps
}

export function useOtherLpsCurrency(defiName: string) {
    const lps = useOtherLps(defiName)
    const tokenPairsWithLiquidityTokens = useMemo(
        () => {
            return lps.map((lp): {liquidityToken: Token, tokens: [Token, Token]} => {
                const dec = new BigNumber(lp.decimals).toString().lastIndexOf('0')
                const dec0 = new BigNumber(lp.lp0.decimals).toString().lastIndexOf('0')
                const dec1 = new BigNumber(lp.lp1.decimals).toString().lastIndexOf('0')

                const tokens: [Token, Token] = [new Token(lp.chainId, lp.lp0.address, dec0, lp.lp0.oracleId, lp.lp0.orcleId), new Token(lp.chainId, lp.lp1.address, dec1, lp.lp1.oracleId, lp.lp1.orcleId)]
                const liquidityToken = new Token(lp.chainId, lp.address, dec, '', lp.name)
                return { liquidityToken, tokens}
            })
        },
        [lps],
      )
    return tokenPairsWithLiquidityTokens
}