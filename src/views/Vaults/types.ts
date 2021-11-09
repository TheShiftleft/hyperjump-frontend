import BigNumber from 'bignumber.js'

export interface VaultUserData {
  account?: string
  walletBalance: BigNumber
  amountDeposited: BigNumber
  allowance: BigNumber
}
