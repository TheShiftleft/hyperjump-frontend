import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getMasterchefContract,
  getMasterchef20Contract,
  getPoolContract,
  getErc721Contract,
  getVaultContract,
  getGovTokenContract,
  getMigratorContract,
  getMechMigratorContract,
  getFarmingTokenContract,
  getOldFarmingTokenContract,
  getXJumpContract,
  getXJumpContract20,
  getMechContract,
  getClaimLpRewardsMigratorContract,
  getSynapseBridgeContract,
  getL2BridgeZapContract,
  getActionInitiatorContract,
} from 'utils/contractHelpers'
import { getLotteryAddress, getSynapseBridgeAddress, getZapAddress } from 'utils/addressHelpers'
import getBridgeConfigFactory from 'utils/bridgeConfigHelpers'
import getMultiChainContract from 'utils/multiChainHelper'
import { getMulticallABI, getWrappedABI, getLotteryABI, getFarmingTokenABI, getZapABI, getApproveABI } from 'config/abi'
import { L2_BRIDGE_ZAP_ABI } from 'config/abi/L2BridgeZap'
import { Contract } from '@ethersproject/contracts'
import { Contract as ContractWeb3 } from 'web3-eth-contract'
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

export const useMasterchef20 = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchef20Contract(web3), [web3])
}

export const useRewardMigrator = () => {
  const web3 = useWeb3()
  return useMemo(() => getMigratorContract(web3), [web3])
}

export const useClaimLpRewardsMigrator = () => {
  const web3 = useWeb3()
  return useMemo(() => getClaimLpRewardsMigratorContract(web3), [web3])
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

export const useSynapseBridgeContract = (chainId: number) => {
  return useMemo(() => getMultiChainContract(L2_BRIDGE_ZAP_ABI.abi, getSynapseBridgeAddress(), chainId), [chainId])
}

export const useBridgeConfigInstance = () => {
  const web3 = useWeb3()
  return useMemo(() => getBridgeConfigFactory(web3), [web3])
}

export const useL2BridgeZapContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getL2BridgeZapContract(web3), [web3])
}

export const useMultiChainContract = (tokenAddress: string, chainId: number) => {
  return useMemo(() => getMultiChainContract(ERC20_ABI, tokenAddress, chainId), [chainId, tokenAddress])
}

export const useMultiChainContractBytes32 = (tokenAddress: string, chainId: number) => {
  return useMemo(() => getMultiChainContract(ERC20_BYTES32_ABI, tokenAddress, chainId), [chainId, tokenAddress])
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

export const useZapContract = (witSignerIfPossible?: boolean) => {
  return useContract(getZapAddress(), getZapABI(), witSignerIfPossible)
}

export const useRevokeContract = (address: string, withSignerIfPossible?: boolean) => {
  return useContract(address, getApproveABI(), withSignerIfPossible)
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
  // who did this??
  //  return useContract(getFarmingTokenAddress(), getFarmingTokenABI(), withSignerIfPossible)

  const web3 = useWeb3()
  return useMemo(() => getFarmingTokenContract(web3), [web3])
}

export const useXJump = () => {
  const web3 = useWeb3()
  return useMemo(() => getXJumpContract(web3), [web3])
}

export const useXJump20 = () => {
  const web3 = useWeb3()
  return useMemo(() => getXJumpContract20(web3), [web3])
}

export const useActionInitiators = () => {
  const web3 = useWeb3()
  return useMemo(() => getActionInitiatorContract(web3), [web3])
}
