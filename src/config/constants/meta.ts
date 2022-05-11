import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'HyperJump - Gamify DeFI',
  description:
    'The most popular AMM on BSC by user count! Earn ALLOY through yield farming or win it in the Lottery, then stake it in Mech Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by HyperJump), NFTs, and more, on a platform you can trust.',
  image: 'https://hyperjump.app/hyperjump-preview.jpg',
}

export const getCustomMeta = (path: string): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${'Home'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/competition':
      return {
        title: `${'Trading Battle'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/prediction':
      return {
        title: `${'Prediction'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/farms':
      return {
        title: `${'Farms'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/pools':
      return {
        title: `${'Pools'} | ${'HyperJump - Gamify DeFI - Gamify DeFIJump'}`,
      }
    case '/lottery':
      return {
        title: `${'Lottery'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/collectibles':
      return {
        title: `${'Collectibles'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/ifo':
      return {
        title: `${'Initial Farm Offering'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/teams':
      return {
        title: `${'Leaderboard'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/profile/tasks':
      return {
        title: `${'Task Center'} | ${'HyperJump - Gamify DeFI'}`,
      }
    case '/profile':
      return {
        title: `${'Your Profile'} | ${'HyperJump - Gamify DeFI'}`,
      }
    default:
      return null
  }
}
