import { MenuEntry } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'

const { config: networkConfig } = getNetwork()

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: 'Swap',
    icon: 'TradeIcon',
    items: [
      {
        label: t('Trade'),
        icon: 'TradeIcon',
        href: `/swap?inputCurrency=${networkConfig.baseCurrency.symbol}&outputCurrency=${getAddress(
          networkConfig.farmingToken.address,
        )}`,
      },
      {
        label: t('Convert'),
        icon: 'SunIcon',
        href: '/convert',
      },
    ],
  },
  {
    label: 'Earn',
    icon: 'FarmIcon',
    items: [
      {
        label: t('Asteroid Farm'),
        icon: 'FarmIcon',
        href: '/farms',
      },
      {
        label: t('Mech Staking'),
        icon: 'PoolIcon',
        href: '/pools',
      },
      {
        label: t('Star Vaults'),
        icon: 'VaultIcon',
        href: '/vaults',
      },
    ],
  },
  {
    label: 'Play',
    icon: 'TrophyIcon',
    items: [
      {
        label: t('Galactic Lottery'),
        icon: 'TrophyIcon',
        href: '/lottery',
      },
      {
        label: t('HyperHeist'),
        icon: 'HomeIcon',
        href: 'https://hyperjump.fi/hyperheist/',
      },
    ],
  },

  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Voting'),
        icon: 'ProposalIcon',
        href: networkConfig.votingLink,
      },
      {
        label: t('Analytics'),
        icon: 'InfoIcon',
        href: `${networkConfig.infoLink}/overview`,
      },
      {
        label: t('GitHub'),
        href: 'https://github.com/HyperJump-DeFi',
      },
      {
        label: t('Docs'),
        href: 'https://docs.hyperjump.fi/',
      },
      {
        label: t('Contracts'),
        href: networkConfig.contractsLink,
      },
      {
        label: t('UnRekt'),
        href: 'https://unrekt.hyperjump.fi/',
      },
    ],
  },
]

export default config
