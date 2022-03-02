import { Network } from '@hyperjump-defi/sdk'

export default {
    [Network.BSC]: {
        pancake: {
            name: 'PancakeSwap',
            url: 'https://raw.githubusercontent.com/beefyfinance/beefy-api/master/src/data/cakeLpPools.json'
        }
    },
    [Network.FTM]: {
        spirit: {
            name: 'SpiritSwap',
            url: 'https://raw.githubusercontent.com/beefyfinance/beefy-api/master/src/data/fantom/spiritPools.json'
        },
        spooky: {
            name: 'SpookySwap',
            url: 'https://raw.githubusercontent.com/beefyfinance/beefy-api/master/src/data/fantom/spookyLpPools.json'
        }
    }
}