/// <reference types="react-scripts" />

interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => Promise<void>
  }
  clover?: {
    request?: (...args: any[]) => Promise<void>
  }
}
