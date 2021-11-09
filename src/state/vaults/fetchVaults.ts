import BigNumber from 'bignumber.js';
import { getVaultABI } from 'config/abi';
import { VaultConfig } from 'config/constants/types';
import { Vault } from 'state/types';
import { BIG_TEN } from 'utils/bigNumber';
import multicall from 'utils/multicall'

const fetchVaultsData = async (vaults: VaultConfig[]): Promise<Vault[]> => {
    const vaultPricePerShareCalls = vaults.map(vault => {
        return {
            address: vault.earnedTokenAddress,
            name: 'getPricePerFullShare'
        };
    });

    const vaultTvlCalls = vaults.map(vault => {
        return {
            address: vault.earnedTokenAddress,
            name: 'balance'
        };
    });

    try {
        const [pricesPerShare, tvls] = await Promise.all([
            multicall(getVaultABI(), vaultPricePerShareCalls),
            multicall(getVaultABI(), vaultTvlCalls)
        ])

        return vaults.map((vault, i) => {
            const price = new BigNumber(pricesPerShare[i]).dividedBy(BIG_TEN.pow(new BigNumber(vault.tokenDecimals)))
            const tvl = new BigNumber(tvls[i])
            return {
                ...vault,
                pricePerFullShare: price.toJSON(),
                tvl: tvl.toJSON()
            }
        })
    } catch (e) {
        console.error(e)
        return []
    }
}

export default fetchVaultsData