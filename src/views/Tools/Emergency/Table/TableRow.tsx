import React, { useCallback, useMemo, useState } from 'react'
import { useCurrency, useToken } from 'hooks/Tokens';
import styled from "styled-components"
import { Text, Button, Heading, Flex } from 'uikit';
import { getLpContract } from 'utils/contractHelpers';
import lpTokenAbi from 'config/abi/lpToken.json'
import multicall from 'utils/multicall';
import { useTokenPairs } from 'contexts/Analytics/TokenData';
import { usePair, usePairs } from 'data/Reserves';
import { usePairData } from 'contexts/Analytics/PairData';
import { getContract } from 'utils';
import { ERC20_ABI } from 'config/abi/erc20';
import { useActiveWeb3React } from 'hooks';
import { usePools } from 'state/hooks';
import { usePairContract } from 'hooks/useContract';
import Loader from 'components/Loader';

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

const TableRow = ({pool}: {pool: {pid: number, address: string}}) => {
  const [tokens, setTokens] = useState([[''],['']])

  const token = useCurrency(pool.address)
  const token0 = useToken(tokens[0][0])
  const token1 = useToken(tokens[1][0])
  const name = !token?.name.includes('LP') ? token?.name : 'LP' 
  
  useMemo(() => {
    let isMounted = true
    if(name === 'LP'){
      const calls = [
        {
          address: pool.address,
          name: 'token0',
          params: []
        },
        {
          address: pool.address,
          name: 'token1',
          params: []
        },
      ]
    
      multicall(lpTokenAbi, calls)
      .then(result => {
        if(isMounted){
          setTokens(result)
        }
      })
    }
    

    return () => {
      isMounted = false
    }
  }, [pool, name])

  return (
    <StyledRowContainer>
      <Container>
        <Flex flexDirection='column' justifyContent='center'>
          <Heading>{name === 'LP' ? `${token0?.symbol}/${token1?.symbol} LP - PID: ${pool.pid}` : name !== undefined ? `${name} - PID: ${pool.pid}` : <Loader/>} </Heading>
          <TextAmount bold>0.316 {name === 'LP' ? `${token0?.symbol}/${token1?.symbol}` : name !== undefined ? `${token?.symbol}` : <Loader/>}</TextAmount>
        </Flex>
        <ButtonContainer>
          <StyledButton scale='sm' marginRight='5px'>
            Emergency Withdraw
          </StyledButton>
          <StyledButton scale='sm' color='black'>
            Revoke
          </StyledButton>
        </ButtonContainer>

      </Container>
    </StyledRowContainer>
    
  )
}

export default TableRow