import axios from 'axios'
import { VaultPriceData } from 'state/types';
import { VAULTS_API_URL } from 'config'

const endpoints = {
  coingecko: 'https://api.coingecko.com/api/v3/simple/price',
  hyper: VAULTS_API_URL,
};

const fetchVaultPricesData = async (): Promise<VaultPriceData> => {
  try {
    const [tokensRes, lpRes ] = await Promise.all([
      axios.get(`${endpoints.hyper}/prices?_=1618245423`),
      axios.get(`${endpoints.hyper}/lps?_=1618245423`)
    ])
    return {
        tokens: tokensRes.data,
        lps: lpRes.data
    }
  } catch (e) {
    console.error(e)
    return { tokens: {}, lps: {} }
  }
}

export default fetchVaultPricesData
