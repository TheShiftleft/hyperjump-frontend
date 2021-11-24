import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getMasterchefContract,
  getPoolContract,
  getErc721Contract,
  getVaultContract,
  getGovTokenContract,
  getMigratorContract,
  getMechMigratorContract,
  getOldFarmingTokenContract,
  getXJumpContract,
  getMechContract,
} from 'utils/contractHelpers'
import { getLotteryAddress, getFarmingTokenAddress } from 'utils/addressHelpers'
import { getMulticallABI, getWrappedABI, getLotteryABI, getFarmingTokenABI } from 'config/abi'
import { Contract } from '@ethersproject/contracts'
import { WRAPPED } from '@hyperjump-defi/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import getNetwork from 'utils/getNetwork'
import { useSelector } from 'react-redux'
import { State } from 'state/types'
import ENS_ABI from '../config/abi/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../config/abi/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import { MULTICALL_ABI, SWAP_MULTICALL_NETWORKS } from '../config/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useXJump = () => {
  const web3 = useWeb3()
  return useMemo(() => getXJumpContract(web3), [web3])
}

export const useRewardMigrator = () => {
  const web3 = useWeb3()
  return useMemo(() => getMigratorContract(web3), [web3])
}

export const useMechMigrator = () => {
  const web3 = useWeb3()
  return useMemo(() => getMechMigratorContract(web3), [web3])
}

export const useOldFarmingToken = () => {
  const web3 = useWeb3()
  return useMemo(() => getOldFarmingTokenContract(web3), [web3])
}

export const useMechToken = () => {
  const web3 = useWeb3()
  return useMemo(() => getMechContract(web3), [web3])
}

export const usePoolContract = (id: number) => {
  const { chainId } = getNetwork()
  const web3 = useWeb3()
  const pool = useSelector((state: State) => state.pools[chainId].data.find((p) => p.sousId === id))
  return useMemo(() => getPoolContract(pool, web3), [pool, web3])
}

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

// export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
//   return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
// }

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WRAPPED[chainId].address : undefined, getWrappedABI(), withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  let address: string | undefined
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useSwapMulticallContract(): Contract | null {
  const { chainId } = getNetwork()
  return useContract(SWAP_MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}
export const useGovTokenContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getGovTokenContract(web3), [web3])
}

export const useStarVaultContract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getVaultContract(address, web3), [address, web3])
}

export const useLotteryContract = (withSignerIfPossible?: boolean): Contract | null => {
  return useContract(getLotteryAddress(), getLotteryABI(), withSignerIfPossible)

  // const web3 = useWeb3()
  // return useMemo(() => getLotteryContract(web3), [web3])
}

export const useFarmingTokenContract = (withSignerIfPossible?: boolean) => {
  return useContract(getFarmingTokenAddress(), getFarmingTokenABI(), withSignerIfPossible)

  // const web3 = useWeb3()
  // return useMemo(() => getFarmingTokenContract(web3), [web3])
}
