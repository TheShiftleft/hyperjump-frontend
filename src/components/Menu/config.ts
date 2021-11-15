import { MenuEntry } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'

const { config: networkConfig } = getNetwork()

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Dashboard'),
    icon: 'NftIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    href: `/swap?inputCurrency=${networkConfig.baseCurrency.symbol}&outputCurrency=${getAddress(
      networkConfig.farmingToken.address,
    )}`,
  },
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
  /*  {
    label: t('Convert'),
    icon: 'ConvertIcon',
    href: '/convert',
  }, */
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
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('GitHub'),
        href: 'https://github.com/HyperJump-DeFi',
        target: '_blank',
      },
      {
        label: t('Docs'),
        href: 'https://docs.hyperjump.fi/',
        target: '_blank',
      },
      {
        label: t('Contracts'),
        href: networkConfig.contractsLink,
        target: '_blank',
      },
      {
        label: t('UnRekt'),
        href: 'https://unrekt.hyperjump.fi/',
        target: '_blank',
      },
    ],
  },
]

export default config
