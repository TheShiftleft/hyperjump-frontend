import React from 'react'
import { Button, Modal, Flex, Text } from 'uikit'
import styled from 'styled-components'

interface InfoModalProps {
  onDismiss?: () => void
  pairExchangeInfo?: string
  addLiquidityUrl?: string
  lpLabel?: string
  earnLabel?: string
}

const StyledInner = styled.div`
  max-width: 234px;
`

const InfoModal: React.FC<InfoModalProps> = ({ pairExchangeInfo, addLiquidityUrl, lpLabel,earnLabel, onDismiss }) => {
  return (
    <Modal title="" onDismiss={onDismiss}>
      <Flex justifyContent="space-between" mb="10px">
        <StyledInner>
          <Text fontSize="14px" color="text" bold>{`Deposit HyperSwap: ${lpLabel} Tokens to earn ${earnLabel}, matey!`}</Text>
        </StyledInner>
        <Button onClick={() => window.open(pairExchangeInfo, '_blank')}>Pair Info</Button>
      </Flex>
      <Button onClick={() => window.open(addLiquidityUrl, '_blank')}>
        Get Liquidity Tokens
      </Button>
    </Modal>
  )
}

export default InfoModal
