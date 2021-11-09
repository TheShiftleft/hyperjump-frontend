import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { VaultBalanceData } from 'state/types'

const fetchVaultBalancesData = async (account: string, tokens: any): Promise<VaultBalanceData> => {
    const tokensList = Object.keys(tokens).map(key => {
        return {
            token: key,
            tokenAddress: tokens[key].tokenAddress,
            tokenBalance: tokens[key].tokenBalance,
        }
    })
    const tokenCalls = tokensList.map(token => {
        return {
            address: token.tokenAddress,
            name: 'balanceOf',
            params: [account]
        }
    });
    try {
        const balances = await multicall(erc20ABI, tokenCalls)
        const newTokens = {}
        tokensList.forEach((tokenEntry, i) => {
            newTokens[tokenEntry.token] = {
                tokenAddress: tokenEntry.tokenAddress,
                tokenBalance: new BigNumber(balances[i].balance._hex).toJSON()
            }
        })
        return newTokens
    } catch (e) {
        console.error(e)
        return {}
    }
}

export default fetchVaultBalancesData