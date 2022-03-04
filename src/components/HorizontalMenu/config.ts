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
Object.keys(bridgeNetworks)
.forEach(function eachKey(key) {
  if(bridgeNetworks[key].chainId !== networkConfig.id){
    if(ChainId.BSC_MAINNET === networkConfig.id && bridgeNetworks[key].chainId === ChainId.FTM_MAINNET ){
      outputChainId = bridgeNetworks[key].chainId
      outputCurrency = bridgeNetworks[key].tokens[0].address
    }else if(ChainId.FTM_MAINNET === networkConfig.id && bridgeNetworks[key].chainId === ChainId.BSC_MAINNET ){
      outputChainId = bridgeNetworks[key].chainId
      outputCurrency = bridgeNetworks[key].tokens[0].address
    }
    
  }else{
    inputCurrency = bridgeNetworks[key].tokens[0].address
  }
});



const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: 'Swap',
    icon: 'TradeIcon',
    items: [
      {
        label: t('Trade'),
        //        icon: 'TradeIcon',
        href: `/swap?inputCurrency=${networkConfig.baseCurrency.symbol}&outputCurrency=${getAddress(
          networkConfig.farmingToken.address,
        )}`,
        target: '_self',
      },
      {
        label: t('Liquidity'),
        //        icon: 'ConvertIcon',
        href: '/pool',
        target: '_self',
      },
      {
        label: t('Zap & Warp'),
        href: '/zap',
        target: '_self',
      },
      {
        label: t('Buy Crypto'),
        //        icon: 'ConvertIcon',
        href: '/onramp',
        target: '_self',
      },
      {
        label: t('Convert & Claim'),
        //        icon: 'ConvertIcon',
        href: '/convert',
        target: '_self',
      },
      {
        label: t('Vortex Bridge'),
        // icon: 'BridgeIcon',
        href: `/bridge?outputChainId=${outputChainId}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`,
        target: '_self',
      },      
    ],
  },
  {
    label: 'Earn',
    icon: 'FarmIcon',
    items: [
      {
        label: t('Asteroid Farm'),
        //        icon: 'FarmIcon',
        href: '/farms',
        target: '_self',
      },
      {
        label: t('Mech Staking'),
        //        icon: 'PoolIcon',
        href: '/pools',
        target: '_self',
      },
    ],
  },
  {
    label: t('Star Vaults'),
    icon: 'VaultIcon',
    href: '/vaults',
    target: '_self',
  },
  {
    label: 'Play',
    icon: 'TrophyIcon',
    items: [
      {
        label: t('Moonbet Casino'),
        //        icon: 'TrophyIcon',
        href: 'https://play.hyperjump.app/',
        target: '_blank',
      },
      {
        label: t('Galactic Lottery'),
        //        icon: 'TrophyIcon',
        href: '/lottery',
        target: '_self',
      },
      {
        label: t('HyperHeist'),
        //        icon: 'HomeIcon',
        href: 'https://hyperjump.fi/hyperheist/',
        target: '_blank',
      },
    ],
  },

  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Voting'),
        //   icon: 'ProposalIcon',
        href: networkConfig.votingLink,
        target: '_blank',
      },
      {
        label: t('Analytics'),
        //    icon: 'InfoIcon',
        href: `${networkConfig.infoLink}/overview`,
        target: '_blank',
      },
      {
        label: t('GitHub'),
        href: 'https://github.com/HyperJump-DeFi',
        target: '_blank',
      },
      {
        label: t('Docs'),
        href: 'https://docs.hyperjump.app/',
        target: '_blank',
      },
      {
        label: t('Contracts'),
        href: 'https://github.com/HyperJump-DeFi/HyperJump-Contracts',
        target: '_blank',
      },
      {
        label: t('UnRekt'),
        href: 'https://unrekt.hyperjump.app/',
        target: '_blank',
      },
      {
        label: t('BSC V1 APP'),
        href: 'https://bscv1.hyperjump.app/',
        target: '_blank',
      },
      {
        label: t('FTM V1 APP'),
        href: 'https://ftm-v1.hyperjump.app/',
        target: '_blank',
      },
    ],
  },
]

export default config
