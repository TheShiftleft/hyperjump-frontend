import Web3 from 'web3'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@hyperjump-defi/sdk'
import { Contract } from '@ethersproject/contracts'

import { _abi as eth_abi } from 'utils/factory/eth_factory'

const CHAINID_ETH = 1
const BRIDGE_CONFIG_ADDRESS = '0x7fd806049608b7d04076b8187dd773343e0589e6'

const PROVIDERS = {
  [CHAINID_ETH]: new JsonRpcProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
  [ChainId.BSC_MAINNET]: new JsonRpcProvider('https://bsc-dataseed1.ninicoin.io'),
  [ChainId.FTM_MAINNET]: new JsonRpcProvider('https://rpc.ftm.tools/'),
}

const getContract = (abi: any, address: string, provider: any) => {
  return new Contract(address, abi, provider)
}

const getBridgeConfigFactory = (web3?: Web3) => {
  return getContract(eth_abi, BRIDGE_CONFIG_ADDRESS, PROVIDERS[CHAINID_ETH])
}

export default getBridgeConfigFactory
