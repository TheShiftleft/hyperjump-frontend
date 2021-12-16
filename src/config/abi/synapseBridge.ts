import { Interface } from '@ethersproject/abi'
import SYNAPSE_BRIDGE_ABI from './synapseBridge.json'

const SYNAPSE_BRIDGE_INTERFACE = new Interface(SYNAPSE_BRIDGE_ABI.abi)

export default SYNAPSE_BRIDGE_INTERFACE
export { SYNAPSE_BRIDGE_ABI }
