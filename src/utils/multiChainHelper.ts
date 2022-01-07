import Web3 from 'web3'
import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from '@hyperjump-defi/sdk'
import { Contract } from '@ethersproject/contracts'

const PROVIDERS = {
  [ChainId.BSC_MAINNET]: new JsonRpcProvider("https://bsc-dataseed.binance.org"),
  [ChainId.FTM_MAINNET]: new JsonRpcProvider("https://rpc.ftm.tools/"),
};

const getContract = (abi: any, address: string, provider: any) => {
  return new Contract(address, abi, provider)
}

const getMultiChainContract = (abi: any, address: string, chainId: number) => {
    
  return getContract(abi, address, PROVIDERS[chainId])
}

export default getMultiChainContract;