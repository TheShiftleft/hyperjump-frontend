import { FarmConfig } from 'config/constants/types'
import fetchFarm from './fetchFarm'

export default function fetchFarms(farmsToFetch: FarmConfig[]) {
  return Promise.all(farmsToFetch.map(fetchFarm))
}
