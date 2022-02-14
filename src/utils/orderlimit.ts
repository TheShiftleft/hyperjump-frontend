import LimitOrdersApi from '@unidexexchange/sdk'

export interface PlaceLimitOrderTxRequest {
  chainId: number
  account: string
  sellToken: string
  sellAmount: string
  buyToken: string
  buyAmount: string
}

export interface CancelLimitOrderTxRequest {
  account: string
  chainId: number
  module: string
  inputToken: string
  outputToken: string
  minReturn: string
  owner: string
  witness: string
}

export interface FetchLimitOrdersTxRequest {
  account: string
  chainId: number
  includeCancelled: boolean
  includeExecuted: boolean
}

export interface Transaction {
  to: string
  from?: string
  data: any
  value?: string
  gasLimit?: string
}

export interface OpenLimitOrder {
  id: string
  blockNumber: string
  createdAt: string
  inputToken: string
  inputAmount: string
  outputToken: string
  minReturn: string
  module: string
  owner: string
  witness: string
  createdTxHash: string
  executedTxHash: string
  cancelledTxHash: string
  vault: string
  updatedAt: string
}

const orderLimit = {
  listOrders: async (request: FetchLimitOrdersTxRequest) => {
    // Fetch list of orders using unidex api function
    const order = await LimitOrdersApi.listOrders(request)
    return order
  },
  cancelOrder: async (request: CancelLimitOrderTxRequest) => {
    // Cancel Order using unidex api
    const order = await LimitOrdersApi.cancelOrder(request)

    return order
  },
}

export default orderLimit
