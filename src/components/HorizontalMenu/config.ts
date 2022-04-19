import { MenuEntry } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import ChainId from 'utils/getChain'
import bridgeNetworks from 'config/constants/bridgeNetworks'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'

const { config: networkConfig } = getNetwork()

let outputChainId
let inputCurrency
let outputCurrency
Object.keys(bridgeNetworks).forEach(function eachKey(key) {
  if (bridgeNetworks[key].chainId !== networkConfig.id) {
    if (ChainId.BSC_MAINNET === networkConfig.id && bridgeNetworks[key].chainId === ChainId.FTM_MAINNET) {
      outputChainId = bridgeNetworks[key].chainId
      outputCurrency = bridgeNetworks[key].tokens[0].address
    } else if (ChainId.FTM_MAINNET === networkConfig.id && bridgeNetworks[key].chainId === ChainId.BSC_MAINNET) {
      outputChainId = bridgeNetworks[key].chainId
      outputCurrency = bridgeNetworks[key].tokens[0].address
    }
  } else {
    inputCurrency = bridgeNetworks[key].tokens[0].address
  }
})

const config: (/* t: ContextApi['t'] */) => MenuEntry[] = (/* t */) => [
  {
    label: 'Swap',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Trade',
        href: `/swap?inputCurrency=${networkConfig.baseCurrency.symbol}&outputCurrency=${getAddress(
          networkConfig.farmingToken.address,
        )}`,
        target: '_self',
      },
      {
        label: 'Liquidity',
        href: '/pool',
        target: '_self',
      },
      {
        label: 'Zap & Warp',
        href: '/zap',
        target: '_self',
      },
      {
        label: 'Vortex Bridge',
        href: `/bridge?outputChainId=${outputChainId}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`,
        target: '_self',
      },
      {
        label: 'Buy Crypto',
        href: '/onramp',
        target: '_self',
      },
    ],
  },
  {
    label: 'Earn',
    icon: 'FarmIcon',
    items: [
      {
        label: 'Asteroid Farm',
        href: '/farms',
        target: '_self',
      },
      {
        label: 'Mech Staking',
        href: '/pools',
        target: '_self',
      },
    ],
  },
  {
    label: 'Star Vaults',
    icon: 'VaultIcon',
    href: '/vaults',
    target: '_self',
  },
  {
    label: 'Tools',
    icon: 'CogIcon',
    items: [
      {
        label: 'Unrekt',
        href: '/unrekt',
        target: '_self'
      }
    ]
  },
  {
    label: 'Play',
    icon: 'TrophyIcon',
    items: [
      {
        label: 'Moonbet Casino',
        href: 'https://play.hyperjump.app/',
        target: '_blank',
      },
      {
        label: 'Galactic Lottery',
        href: '/lottery',
        target: '_self',
      },
      {
        label: 'HyperHeist',
        href: 'https://hyperheist.hyperjump.app/',
        target: '_blank',
      },
    ],
  },

  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Voting',
        href: networkConfig.votingLink,
        target: '_blank',
      },
      {
        label: 'Analytics',
        href: `${networkConfig.infoLink}/overview`,
        target: '_blank',
      },
      {
        label: 'Migrations',
        href: '/migrations',
        target: '_self',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/HyperJump-DeFi',
        target: '_blank',
      },
      {
        label: 'Docs',
        href: 'https://docs.hyperjump.app/',
        target: '_blank',
      },
      {
        label: 'Contracts',
        href: 'https://github.com/HyperJump-DeFi/HyperJump-Contracts',
        target: '_blank',
      },
      {
        label: 'UnRekt',
        href: 'https://unrekt.hyperjump.app/',
        target: '_blank',
      },
      {
        label: 'BSC V1 APP',
        href: 'https://bscv1.hyperjump.app/',
        target: '_blank',
      },
      {
        label: 'FTM V1 APP',
        href: 'https://ftm-v1.hyperjump.app/',
        target: '_blank',
      },
      {
        label: 'BSC Farmv2.0 APP',
        href: 'https://bscfarmv2.hyperjump.app/',
        target: '_blank',
      },
      {
        label: 'FTM Farmv2.0 APP',
        href: 'https://ftmfarmv2.hyperjump.app/',
        target: '_blank',
      },
    ],
  },
]

export default config
