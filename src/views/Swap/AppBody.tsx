import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit'
import useWindowDimensions from 'hooks/useWindowDimension'

export const BodyWrapper = styled(Card)<{flexDirection?: string, account?: string, width?: number, showChart?: boolean}>`
  position: relative;
  padding: 20px 10px;
  width: 436px;
  max-width: 436px;
  width: 92%;
  z-index: 5;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 32px;
  background-color: rgba(13,29,54,0.5);
  display: flex;
  flex-direction: ${({flexDirection}) => (!!flexDirection && flexDirection === "row" ? "row" : "column")};

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: ${({account, showChart, width}) => (showChart && account && width >= 1400) ? '1600px' : '436px'};
}
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, flexDirection, account, showChart}: { children: React.ReactNode, flexDirection?: string, account?: string, showChart?: boolean }) {
  const {width} = useWindowDimensions()
  return <BodyWrapper flexDirection={flexDirection} account={account} width={width} showChart={showChart}>{children}</BodyWrapper>
}
