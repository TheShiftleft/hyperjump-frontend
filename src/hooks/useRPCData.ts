import { useCallback } from 'react';
import { QueriesResults, useQueries, UseQueryResult } from 'react-query';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface Request extends AxiosRequestConfig {
  requestStart: number
  latency: number
}

interface Response extends AxiosResponse {
  config: Request
  latency?: number
}

interface Queries{
  queryKey: string[]
  queryFn: () => void
  select: (data: any) => {
    url: string
    height: number
    latency: number
  }
  refetchInterval: number
}

export interface RPCData {
  data: {
    url: string
    height: number
    latency: number
    trust: string
  },
  isLoading: boolean
  status: string
}

export const rpcBody = JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_getBlockByNumber',
  params: ['latest', false],
  id: 1,
});

const fetchChain = async (baseURL) => {
  if (baseURL.includes('API_KEY')) return null
  try {
    let API = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    API.interceptors.request.use((request: Request) => {
      return {...request, requestStart: Date.now()}
    });

    API.interceptors.response.use(
      (response: Response) => {
        return {...response, latency: Date.now() - response.config?.requestStart}
      },
      (error) => {
        if (error.response) {
          error.response.latency = null
        }

        return Promise.reject(error)
      }
    );

    let { data, latency }: Response = await API.post('', rpcBody)

    return { ...data, latency }
  } catch (error) {
    return null
  }
};

const formatData = (url, data) => {
  let height = data?.result?.number ?? null;
  let latency = data?.latency ?? null;
  if (height) {
    const hexString = height.toString(16);
    height = parseInt(hexString, 16);
  } else {
    latency = null;
  }
  return { url, height, latency };
};

function createPromise() {
  let resolve
  let reject
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
    return {resolve: _resolve, reject: _reject}
  });

  return {resolve, reject}
}

const fetchWssChain = async (baseURL) => {
  try {
    // small hack to wait until socket connection opens to show loading indicator on table row
    const queryFn = createPromise();

    const socket = new WebSocket(baseURL);
    let requestStart;

    socket.onopen = () => {
      socket.send(rpcBody);
      requestStart = Date.now();
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const latency = Date.now() - requestStart;
      queryFn.resolve({ ...data, latency });
    };

    socket.onerror = (e) => {
      queryFn.reject(e);
    };

    return await queryFn;
  } catch (error) {
    return null;
  }
};

const useQuery = (url:string): Queries => {
  const callback = useCallback((data) => formatData(url, data), [url])
  if(url.includes('wss://')){
    // Socket Query
    return {
      queryKey: [url],
      queryFn: () => fetchWssChain(url),
      select: callback,
      refetchInterval: 5000,
    }
  }
  return {
    // Http Query
    queryKey: [url],
    queryFn: () => fetchChain(url),
    refetchInterval: 5000,
    select: callback,
  }
}

const useRPCData = (urls) => {
  const queries = urls.map(useQuery)
  return useQueries(queries)
}

export default useRPCData;
