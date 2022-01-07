import LimitOrdersApi from '@unidexexchange/sdk'
import { getLimitOrderContract } from 'utils/contractHelpers'
import useWeb3 from './useWeb3'

export interface PlaceLimitOrderTxRequest {
    chainId: number;
    account: string;
    sellToken: string;
    sellAmount: string;
    buyToken: string;
    buyAmount: string;
}
  
export interface CancelLimitOrderTxRequest {
    account: string;
    chainId: number;
    module: string;
    inputToken: string;
    outputToken: string;
    minReturn: string;
    owner: string;
    witness: string;
}
  
export interface FetchLimitOrdersTxRequest {
    account: string;
    chainId: number;
    includeCancelled: boolean;
    includeExecuted: boolean;
}
  
export interface Transaction {
    to: string;
    from?: string;
    data: any;
    value?: string;
    gasLimit?: string;
}
  
export interface OpenLimitOrder {
    id: string;
    blockNumber: string;
    createdAt: string;
    inputToken: string;
    inputAmount: string;
    outputToken: string;
    minReturn: string;
    module: string;
    owner: string;
    witness: string;
    createdTxHash: string;
    executedTxHash: string;
    cancelledTxHash: string;
    vault: string;
    updatedAt: string;
}


export const usePlaceOrder = async (request: PlaceLimitOrderTxRequest) => {
    const web3 = useWeb3()

    const limitOrdersContract = getLimitOrderContract(web3)
    // Place order using unidex api function
    try{
        const order = await LimitOrdersApi.placeOrder(request)
        const deposit = {
            payableAmount: request.sellAmount,
            _data: order.data
        }
        const orderResponse = await limitOrdersContract.methods.depositEth(deposit).call()
        console.log(orderResponse)
        return orderResponse
    }catch(e){
        console.log('error', e)
        return e
    }

}

