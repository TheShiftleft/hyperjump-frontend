import BigNumber from "bignumber.js"
import erc20ABI from 'config/abi/erc20.json'
import { VaultConfig } from "config/constants/types"
import { VaultAllowanceData } from "state/types"
import multicall from "utils/multicall"

const fetchVaultAllowancesData = async (account: string, vaults: VaultConfig[]): Promise<VaultAllowanceData> => {
    const allowancesCalls = vaults.map(vault => {
        return {
            address: vault.tokenAddress,
            name: 'allowance',
            params: [account, vault.earnContractAddress]
        }
    })

    try {
        const allowances = await multicall(erc20ABI, allowancesCalls)

        return allowances.map(allowance => {
            return new BigNumber(allowance[0]._hex).toJSON()
        })
    } catch (e) {
        console.error(e)
        return []
    }
}

export default fetchVaultAllowancesData