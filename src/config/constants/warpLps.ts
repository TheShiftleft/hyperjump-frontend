import { Network } from '@hyperjump-defi/sdk'

export default {
    [Network.BSC]: {
        PancakeSwap: {
            name: 'PancakeSwap',
            logoUrl: 'https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
            url: 'https://raw.githubusercontent.com/beefyfinance/beefy-api/master/src/data/cakeLpPools.json',
            imageUrl: 'https://pancakeswap.finance/images/tokens'
        }
    },
    [Network.FTM]: {
        SpiritSwap: {
            name: 'SpiritSwap',
            logoUrl: 'https://swap.spiritswap.finance/images/coins/SPIRIT.png',
            url: 'https://raw.githubusercontent.com/beefyfinance/beefy-api/master/src/data/fantom/spiritPools.json',
            imageUrl: 'https://swap.spiritswap.finance/images/coins'
        },
        SpookySwap: {
            name: 'SpookySwap',
            logoUrl: 'https://assets.spookyswap.finance/tokens/BOO.png',
            url: 'https://raw.githubusercontent.com/beefyfinance/beefy-api/master/src/data/fantom/spookyLpPools.json',
            imageUrl: 'https://assets.spookyswap.finance/tokens'
        }
    }
}