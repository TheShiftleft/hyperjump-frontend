import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit'

export const BodyWrapper = styled(Card)`
  position: relative;
  padding: 20px 10px;
  max-width: 436px;
  width: 92%;
  z-index: 5;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 32px;
  background-color: rgba(13,29,54,0.5);
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
