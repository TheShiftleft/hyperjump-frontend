import { Interface } from '@ethersproject/abi'
import L2_BRIDGE_ZAP_ABI from './L2BridgeZap.json'

const L2_BRIDGE_ZAP_INTERFACE = new Interface(L2_BRIDGE_ZAP_ABI.abi)

export default L2_BRIDGE_ZAP_INTERFACE
export { L2_BRIDGE_ZAP_ABI }
