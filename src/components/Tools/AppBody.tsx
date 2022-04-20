import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit'
import useWindowDimensions from 'hooks/useWindowDimension'

export const BodyWrapper = styled(Card)<{flexDirection?: string, width?: number}>`
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
  flex-direction: column;
  min-height: 436px;

  ${({ theme }) => theme.mediaQueries.sm} {
      max-width: 1000px;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, flexDirection, width }: { children: React.ReactNode, flexDirection?: string, width?: number}) {
  return <BodyWrapper flexDirection={flexDirection} width={width}>{children}</BodyWrapper>
}
