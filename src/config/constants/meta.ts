import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'HyperJump - Gamify DeFI',
  description:
    'The most popular AMM on BSC by user count! Earn ALLOY through yield farming or win it in the Lottery, then stake it in Mech Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by HyperJump), NFTs, and more, on a platform you can trust.',
  image: 'https://hyperjump.app/hyperjump-preview.jpg',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('HyperJump - Gamify DeFI - Gamify DeFIJump')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('HyperJump - Gamify DeFI')}`,
      }
    default:
      return null
  }
}
