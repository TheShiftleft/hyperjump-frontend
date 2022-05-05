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
import { usePairContract } from 'hooks/useContract';
import Loader from 'components/Loader';
import { useEmergencyWithdraw, useGetLPTokens, useGetPoolBalance } from 'hooks/useGetPools';
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import { getMasterChefABI } from 'config/abi';
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

const TableRow = ({pool, masterchefAddress}: {pool: {pid: number, address: string}, masterchefAddress: string}) => {
  const { toastError, toastSuccess } = useToast()
  const blockExplorer = SCANNER_URL
  const token = useCurrency(pool.address)
  const name = !token?.name.includes('LP') ? token?.name : 'LP' 
  const tokens = useGetLPTokens(name === 'LP' ? pool.address : undefined)
  const { amount } = useGetPoolBalance(pool?.pid, masterchefAddress)

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

  const emergencyWithdraw = useEmergencyWithdraw(pool?.pid, masterchefAddress)

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
        toastError('Error', 'Emergency withdraw was failed!')
      }
  }, [emergencyWithdraw, toastError, toastSuccess, blockExplorer])

  return (
    <StyledRowContainer>
      <Container>
        <Flex flexDirection='column' justifyContent='center'>
          <Heading>{name === 'LP' ? token0 && token1 ? `${token0?.symbol}/${token1?.symbol} LP - PID: ${pool.pid}` : '' : name !== undefined ? `${name} - PID: ${pool.pid}` : <Loader/>} </Heading>
          <TextAmount bold>{displayBalance()} {name === 'LP' ? `${token0?.symbol}/${token1?.symbol}` : name !== undefined ? `${token?.symbol}` : <Loader/>}</TextAmount>
        </Flex>
        <ButtonContainer>
          <StyledButton scale='sm' marginRight='5px' onClick={() => {
            handleEmergencyWithdraw()
          }}>
            Emergency Withdraw
          </StyledButton>
          <StyledButton scale='sm' color='black' onClick={() => {
            console.log('clicked')
          }}>
            Revoke
          </StyledButton>
        </ButtonContainer>

      </Container>
    </StyledRowContainer>
    
  )
}

export default TableRow