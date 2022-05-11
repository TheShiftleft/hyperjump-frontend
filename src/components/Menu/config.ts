import { MenuEntry } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'

const { config: networkConfig } = getNetwork()

const config: () => MenuEntry[] = () => [
  {
    label: 'Dashboard',
    icon: 'NftIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    href: `/swap?inputCurrency=${networkConfig.baseCurrency.symbol}&outputCurrency=${getAddress(
      networkConfig.farmingToken.address,
    )}`,
  },
  {
    label: 'Asteroid Farm',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Mech Staking',
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: 'Star Vaults',
    icon: 'VaultIcon',
    href: '/vaults',
  },
  /*  {
    label: t('Convert'),
    icon: 'ConvertIcon',
    href: '/convert',
  }, */
  {
    label: 'Galactic Lottery',
    icon: 'TrophyIcon',
    href: '/lottery',
  },
  {
    label: 'HyperHeist',
    icon: 'HomeIcon',
    href: 'https://hyperjump.app/hyperheist/',
  },
  {
    label: 'Voting',
    icon: 'ProposalIcon',
    href: networkConfig.votingLink,
  },
  {
    label: 'Analytics',
    icon: 'InfoIcon',
    href: `${networkConfig.infoLink}/overview`,
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
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
        href: networkConfig.contractsLink,
        target: '_blank',
      },
      {
        label: 'UnRekt',
        href: 'https://unrekt.hyperjump.app/',
        target: '_blank',
      },
    ],
  },
]

export default config
