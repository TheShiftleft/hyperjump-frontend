import Web3 from 'web3'
import useWeb3 from 'hooks/useWeb3'
import { JsonRpcProvider } from "@ethersproject/providers";
import ChainId from 'utils/getChain';
import { Contract } from '@ethersproject/contracts'

const PROVIDERS = {
  [ChainId.ETH]: new JsonRpcProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),
  [ChainId.BSC_MAINNET]: new JsonRpcProvider("https://bsc-dataseed1.ninicoin.io"), // https://bsc-dataseed.binance.org
  [ChainId.FTM_MAINNET]: new JsonRpcProvider("https://rpc.ftm.tools/"),
  [ChainId.POLYGON]: new JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/O6nbQONUKZ-V4B_4111Xt7Dg0vm_bQEm"),
  [ChainId.BOBA]: new JsonRpcProvider("https://mainnet.boba.network/"),
  [ChainId.MOONRIVER]: new JsonRpcProvider("https://rpc.moonriver.moonbeam.network"),
  [ChainId.ARBITRUM]: new JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
  [ChainId.AVALANCHE]: new JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"),
  [ChainId.HARMONY]: new JsonRpcProvider("https://api.harmony.one"),
};

const getContract = (abi: any, address: string, provider: any) => {
  return new Contract(address, abi, provider)
}

const getMultiChainContract = (abi: any, address: string, chainId: number) => {
  return (address ?? undefined ? getContract(abi, address, PROVIDERS[chainId]) : undefined)
}



export default getMultiChainContract; 