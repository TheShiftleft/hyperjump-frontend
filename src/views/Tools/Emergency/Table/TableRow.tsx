import React, { useCallback, useMemo, useState } from 'react'
import { useCurrency, useToken } from 'hooks/Tokens';
import styled from "styled-components"
import { Text, Button, Heading, Flex, Link } from 'uikit';
import { getLpContract } from 'utils/contractHelpers';
import lpTokenAbi from 'config/abi/lpToken.json'
import multicall from 'utils/multicall';
import { useTokenPairs } from 'contexts/Analytics/TokenData';
import { usePair, usePairs } from 'data/Reserves';
import { usePairData } from 'contexts/Analytics/PairData';
import { getContract } from 'utils';
import { ERC20_ABI } from 'config/abi/erc20';
import { useActiveWeb3React } from 'hooks';
import { useFarmUser, usePools } from 'state/hooks';
import { usePairContract, usePoolContract, useTokenContract } from 'hooks/useContract';
import Loader from 'components/Loader';
import { useEmergencyWithdraw, useGetLPTokens, useGetPoolBalance, useRevokePool } from 'hooks/useGetPools';
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import { getMasterChefABI, getPoolABI } from 'config/abi';
import useToast from 'hooks/useToast';
import { SCANNER_URL } from 'config';

const StyledRowContainer = styled.tr`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.4);

  padding: 8px 20px;
  margin-bottom: 20px;
  display: flex;
`

const Container = styled.td`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TextAmount = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const StyledButton = styled(Button)`
  max-height: 30px;
  padding: 5px !important;
  border-radius: 5px;
  color: black;
`

const StyledLink = styled(Link)`
  color: white;
`

const TableRow = ({pool}: {pool: {pid: number, address: string, masterchef: string}}) => {
  const {pid, address, masterchef} = pool
  const [ isEnabled, setIsEnabled ] = useState(false)
  const { account } = useActiveWeb3React()
  const { toastError, toastSuccess } = useToast()
  const blockExplorer = SCANNER_URL
  const token = useCurrency(address)
  const name = !token?.name.includes('LP') ? token?.name : 'LP' 
  const tokens = useGetLPTokens(name === 'LP' ? address : undefined)
  const { amount } = useGetPoolBalance(pid, masterchef)

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(amount, token?.decimals)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.001)) {
      return getFullDisplayBalance(amount, token?.decimals).toLocaleString()
    }
    if(stakedBalanceBigNumber.lte(0)){
      return stakedBalanceBigNumber.toFixed(0)
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [amount, token])

  const token0 = useToken(tokens[0][0])
  const token1 = useToken(tokens[1][0])
  const emergencyWithdraw = useEmergencyWithdraw(pid, masterchef)
  const contract = useTokenContract(address)
  useMemo(() => {
    let isMounted = true
    if(contract){
      contract.allowance(account, masterchef)
      .then(result => {
        if(isMounted){
          setIsEnabled(result.gt(0))
        }
      })
      .catch((e) => {
        console.error(e)
      })
    }

    return () => {
      isMounted = false
    }    
  },[contract, account, masterchef])
  const revokePool = useRevokePool(masterchef, address)

  const handleRevokePool = useCallback(async () => {
    try{
      const result = await revokePool()
      if(result) {
        const tx = await result.wait()
        if(tx.status) {
          toastSuccess('Success', <Text>Pool was successfully revoked. <Link target='_blank' href={`${blockExplorer}/tx/${tx.transactionHash}`}>View transaction</Link></Text>)
        }else{
          toastError('Error', 'Failed to revoke pool!')
        }
      }
    }catch(e) {
      console.error(e)
      let msg = 'Failed to revoke pool!'
      let title = 'Error'
      if(e.code === 4001){
        msg = 'User cancelled the transaction!'
        title = 'Transaction Cancelled'
      }
      toastError(title, msg)
    }
  }, [revokePool, toastError, toastSuccess, blockExplorer])

  const handleEmergencyWithdraw = useCallback(async () => {
      try{
          const result = await emergencyWithdraw()
          if(result){
          const tx = await result.wait()
          if(tx.status) {
            toastSuccess('Success', <Text>Emergency withdraw was successful. <Link target='_blank' href={`${blockExplorer}/tx/${tx.transactionHash}`}>View transaction</Link></Text>)
          }else{
            toastError('Error', 'Emergency withdraw was failed!')
          }
        }
      }catch(e) {
        console.error(e)
        let msg = 'Emergency withdraw was failed!'
        let title = 'Error'
        if(e.code === 4001){
          msg = 'User cancelled the transaction!'
          title = 'Transaction Cancelled'
        }
        toastError(title, msg)
      }
  }, [emergencyWithdraw, toastError, toastSuccess, blockExplorer])

  return (
    <StyledRowContainer>
      <Container>
        <Flex flexDirection='column' justifyContent='center'>
          <Heading>{
            name === 'LP' && (token0 && token1) ? 
            <StyledLink target='_blank' href={`${blockExplorer}/address/${address}`}>{`${token0?.symbol}/${token1?.symbol} LP - PID: ${pid}`}</StyledLink> 
            : name !== undefined ? 
            <StyledLink target='_blank' href={`${blockExplorer}/address/${address}`}>{`${name} - PID: ${pid}`}</StyledLink> 
            : <Loader/>} 
          </Heading>
          <TextAmount bold>{displayBalance()} {name === 'LP' ? `${token0?.symbol}/${token1?.symbol}` : name !== undefined ? `${token?.symbol}` : <Loader/>}</TextAmount>
        </Flex>
        <ButtonContainer>
          <StyledButton scale='sm' marginRight='5px' onClick={() => {
            handleEmergencyWithdraw()
          }}>
            Emergency Withdraw
          </StyledButton>
          <StyledButton scale='sm' color='black' disabled={!isEnabled} onClick={() => {
            handleRevokePool()
          }}>
            Revoke
          </StyledButton>
        </ButtonContainer>

      </Container>
    </StyledRowContainer>
    
  )
}

export default TableRow