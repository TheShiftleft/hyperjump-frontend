import React from 'react'
import styled from "styled-components";
import { Text } from 'uikit';
import { Currency } from '@hyperjump-defi/sdk';
import { NetworkIcon } from 'components/Tools';

interface NetworkCellProps {
  network: Currency
  label: string
  alt: string
}

const NetworkCellContainer = styled.div`
  padding: 12px 0px;
  align-items: center;
  padding-right: 8px;
  display: flex;
`

const NetworkLabel = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 300px;
    display: flex;
  }
`

const NetworkCell = ({network, label, alt}: NetworkCellProps) => {
  return (
    <NetworkCellContainer>
      <NetworkIcon symbol={network.symbol} alt={alt}/>
      <NetworkLabel>{label}</NetworkLabel>
    </NetworkCellContainer>
  )
}

export default NetworkCell