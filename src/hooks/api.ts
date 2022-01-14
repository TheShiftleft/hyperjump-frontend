import { VAULTS_API_URL } from 'config'
import { useEffect, useState } from 'react'
import getNetwork from 'utils/getNetwork'

/* eslint-disable camelcase */
export interface ApiResponse {
  tvl: number
}

export interface CirculatingSupplyApiResponse {
  totalCirculatingSupply: number,
  ftm: number,
  bsc: number
}

export const useGetBscStats = () => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const { config } = getNetwork()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://vaultsapi.hyperjump.app/tvl`)
        const responseData: ApiResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [config.network, setData])

  return data
}

export const useGetFtmStats = () => {
  const [ftmData, setFtmData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ftmResponse = await fetch('https://vaultsapi.hyperjump.app/tvl')
        const ftmResponseData: ApiResponse = await ftmResponse.json()

        setFtmData(ftmResponseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setFtmData])

  return ftmData
}

export const useGetCirculatingSupplyStats = () => {
  const [data, setData] = useState<CirculatingSupplyApiResponse | null>(null)
  const { config } = getNetwork()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://vaultsapi.hyperjump.app/circulating_supply`)
        const responseData: CirculatingSupplyApiResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [config.network, setData])

  return data
}

