import axios from 'axios';

interface PlaceLimitOrderTxRequest {
    chainId: number;
    account: string;
    sellToken: string;
    sellAmount: string;
    buyToken: string;
    buyAmount: string;
}

interface CancelLimitOrderTxRequest {
    account: string;
    chainId: number;
    module: string;
    inputToken: string;
    outputToken: string;
    minReturn: string;
    owner: string;
    witness: string;
}

interface FetchLimitOrdersTxRequest {
    account: string;
    chainId: number;
    includeCancelled: boolean;
    includeExecuted: boolean;
}

interface Transaction {
    to: string;
    from?: string;
    data: any;
    value?: string;
    gasLimit?: string;
}

interface OpenLimitOrder {
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
  
const objToQueryParams = (obj: any) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&');

const BASE_URL = 'https://unidex-backend.herokuapp.com';

class LimitOrdersApi {
  static async listOrders(request: FetchLimitOrdersTxRequest): Promise<OpenLimitOrder[]> {
    const params = objToQueryParams(request);
    const url = `${BASE_URL}/orders/limit/list?${params}`;
    const { data } = await axios.get(url);

    return data;
  }

  static async placeOrder(request: PlaceLimitOrderTxRequest): Promise<Transaction> {
    const params = objToQueryParams(request);
    const url = `${BASE_URL}/orders/limit?${params}`;
    const { data } = await axios.get(url);

    return data.tx;
  }

  static async cancelOrder(request: CancelLimitOrderTxRequest): Promise<Transaction> {
    const { account, chainId, module, inputToken, outputToken, minReturn, owner, witness } = request;

    const params = objToQueryParams({
      account,
      chainId,
      module,
      inputToken,
      outputToken,
      minReturn,
      owner,
      witness
    });
    const url = `${BASE_URL}/orders/limit/cancel?${params}`;
    const { data } = await axios.get(url);

    return data.tx;
  }
}

export default LimitOrdersApi;
