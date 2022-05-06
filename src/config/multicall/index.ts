import { ChainId } from '@hyperjump-defi/sdk'
import MULTICALL_ABI from './abi.json'

// TODO: move to constants/contracts <-- angry mech
const SWAP_MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.BSC_MAINNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.BSC_TESTNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.FTM_MAINNET]: '0x6185A664e90754F4967B9962Fe7B1183b147fc48',
  [ChainId.FTM_TESTNET]: '0x6185A664e90754F4967B9962Fe7B1183b147fc48', // does NOT exist
  [ChainId.METIS]: '0x1e2339616899A3130C72C62D35DC2b2B23598949',
}

export { MULTICALL_ABI, SWAP_MULTICALL_NETWORKS }
