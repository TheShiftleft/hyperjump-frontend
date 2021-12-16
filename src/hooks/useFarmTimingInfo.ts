import { Network } from '@hyperjump-defi/sdk'
import { useBlock } from '../state/hooks'
import { Farm } from '../state/types'
import getNetwork from '../utils/getNetwork'
import useSecond from './useSecond'

const currentPointInChain: Record<Network, () => number> = {
  [Network.BSC]: () => useBlock().currentBlock,
  [Network.BSC_TESTNET]: () => useBlock().currentBlock,
  [Network.FANTOM]: useSecond,
}

const useFarmTimingInfo = (farm: Farm) => {
  const { config } = getNetwork()
  const currentPoint = currentPointInChain[config.network]()
  const scaleFactor = config.timerScale
  const { startBlock, endBlock, isFinished } = farm
  const shouldShowCountdown = Boolean(!isFinished && startBlock && endBlock)
  const untilStart = Math.max(startBlock - currentPoint, 0) * scaleFactor
  const remaining = Math.max(endBlock - currentPoint, 0) * scaleFactor
  const hasPoolStarted = untilStart === 0 && remaining > 0
  const toDisplay = hasPoolStarted ? remaining : untilStart
  return { shouldShowCountdown, untilStart, remaining, hasPoolStarted, toDisplay }
}

export default useFarmTimingInfo
