import React, { useCallback, useMemo, useState } from 'react'
import Container from 'components/Container'
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { Input, Flex, Button } from 'uikit'
import { GetPoolsStatus, PoolData, useGetPools } from 'hooks/useGetPools'
import useToast from 'hooks/useToast'
import { useActiveWeb3React } from 'hooks'
import { getContract } from 'utils'
import { ERC20_ABI } from 'config/abi/erc20'
import multicall from 'utils/multicall'
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import useWeb3 from 'hooks/useWeb3'
import { getApproveABI } from 'config/abi'
import EmergencyTable from './Table'

const Unrekt = () => {
  const [inputAddress, setInputAddress] = useState('')
  const { toastError, toastSuccess } = useToast()
  const [ tableData, setTableData ] = useState<PoolData[]>()
  const [ enabledPools, setEnabledPools ] = useState<PoolData[]>()
  const {status, callback, error} = useGetPools(inputAddress)
  const [ isLoading, setIsLoading ] = useState(false)
  const { library, account } = useActiveWeb3React()
  const isDataLoaded = !tableData
  const web3 = useWeb3()

  useMemo(async () => {
    if(tableData) {
      const calls = tableData.map(data => {
        return {
          ...data,
          name: 'allowance',
          params: [account, data.masterchef]
        }
      })
      const results = await multicall(ERC20_ABI, calls)
      const newResults = results.map((res, index) => {
        return {
          ...calls[index],
          allowance: res
        }
      })
      const finalResult = newResults.filter(res => {
        const allowance = new BigNumber(res.allowance.toString())
        return allowance.gt(0)
      })
      setEnabledPools(finalResult)
    }
  },[account, tableData])

  const handleGetPools = useCallback(
    async () => {
      setIsLoading(true)
      if(error){
        toastError('Error', error)
        setIsLoading(false)
        return
      }
      if(status === GetPoolsStatus.VALID){
        const result = await callback()
        if(result){
          setTableData(result)
          setIsLoading(false)
        }else{
          setTableData(undefined)
          setEnabledPools(undefined)
          setIsLoading(false)
          toastError('Unable to fetch masterchef', 'Make sure the address and network is correct')
        }
      }
  },[callback, error, status, toastError])

  const handleRevokeAll = useCallback(
    async () => {
      if(tableData && enabledPools) {
        const gas = await web3.eth.getGasPrice()
        const promiseArr = enabledPools?.map((v) => {
          const contract = getContract(v.address, getApproveABI(), library, account)
          return contract.approve(v.masterchef, 0, {gasPrice: gas})
        })
        const promiseResults = await Promise.all(promiseArr)
        Promise.all(promiseResults)
          .then((result) => {
            const resultsArr = result.map(r => r.wait)
            Promise.all(resultsArr)
            .then(confirmations => {
              toastSuccess('Revoked', 'All addresses has been revoked!')
            })
          })
          .catch((e) => {
            console.error(e)
            let msg = 'An error occured while processing transaction.'
            let title = 'Revoke Error'
            if(e.code === 4001){
              title = 'Transaction Cancelled'
              msg = 'User cancelled the transaction.'
            }
            toastError(title, msg)
          })
      }
    },
    [tableData, account, toastError, toastSuccess, web3, library, enabledPools]
  )

  return (
    <Container>
      <AppBody>
        <PageHeader type='emergency' description="Find & revoke all the addresses that can spend your tokens!" />
        <CardBody>
          <Flex justifyContent='space-between' mb="10px">
            <Input 
            value={inputAddress}
            onInput={
              (data) => {
                const target = data.target as HTMLTextAreaElement
                setInputAddress(target.value.trim())
            }} 
            placeholder='Enter Masterchef Address' style={{flex: '1', height: '48px'}}/>
            <Button 
              ml='5px'
            onClick={() => handleGetPools()}
              >
              Start
            </Button>
            <Button 
              ml='5px'
              onClick={() => console.log('Emergency Withdraw All clicked')}
              disabled={isDataLoaded}
              >
              Emergency Withdraw All
            </Button>
            <Button 
              ml='5px'
              onClick={() => handleRevokeAll()}
              disabled={isDataLoaded && !enabledPools}
              >
              Revoke All
            </Button>
          </Flex>
          <EmergencyTable data={tableData} isLoading={isLoading}/>
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Unrekt
