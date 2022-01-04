import {LimitOrdersApi} from '@unidexexchange/sdk'

interface OrderRequest {
    chainId: number,
    account: string,
    sellToken: string,
    sellAmount:string,
    buyToken: string,
    buyAmount: string
}

interface FetchLimitOrderRequest {
    account: string;
    chainId: number;
    includeCancelled: boolean;
    includeExecuted: boolean;
  }

interface CancelOrderRequest {
    account: string;
    chainId: number;
    module: string;
    inputToken: string;
    outputToken: string;
    minReturn: string;
    owner: string;
    witness: string;
}

const orderLimit = {
    placeOrder : async (request: OrderRequest) => {
    
      // Place order using unidex api function
      const order = await LimitOrdersApi.placeOrder(request)
    
      // Submit order to the blockchain
      // 
      return order
    },
    listOrder : async (request: FetchLimitOrderRequest) => {
    
        // Fetch list of orders using unidex api function
        console.log('request', request)
        const order = await LimitOrdersApi.listOrders(request)
        console.log('order', order)
        return order
    },
    cancelOrder : async (request: CancelOrderRequest) => {

        // Cancel Order using unidex api
        const order = await LimitOrdersApi.cancelOrder(request)
    
        return order
    }
}

export default orderLimit