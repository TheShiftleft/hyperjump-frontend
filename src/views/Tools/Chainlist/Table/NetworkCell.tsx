import React from 'react'
import styled from "styled-components";
import { Text } from 'uikit';
import { Currency } from '@hyperjump-defi/sdk';
import { NetworkIcon } from 'components/Tools';
import { Chain } from '.';

interface NetworkCellProps {
  chain: Chain
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

const NetworkCell = ({chain, label, alt}: NetworkCellProps) => {
  return (
    <NetworkCellContainer>
      <NetworkIcon chain={chain} size='32px' alt={alt}/>
      <NetworkLabel>{label}</NetworkLabel>
    </NetworkCellContainer>
  )
}

export default NetworkCell