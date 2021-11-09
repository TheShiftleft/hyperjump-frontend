import React from 'react'
import styled from 'styled-components'
import PanelBody from './PanelBody'
import PanelFooter from './PanelFooter'
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from '../config'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  showMenu: boolean
  isMobile: boolean
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean; isMobile: boolean }>`
  background-color: ${({ isMobile }) => (isMobile ? "rgba(13, 29, 54, 1)" : "rgba(13, 29, 54, 0.4)")};
  position: fixed;
  padding-top: ${({ showMenu }) => (showMenu ? '20px' : 0)};
  top: ${({ isMobile }) => (isMobile ? `${MENU_HEIGHT * 2}px` : `calc(${MENU_HEIGHT}px + 30px)`)};
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: ${({ isMobile }) => (isMobile ? `calc(100vh - ${MENU_HEIGHT}px)` : `85vh`)};
  transition: padding-top 0.2s, width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-color: ${({ theme }) => theme.colors.primary};
  border-top: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  border-right: ${({ theme, isPushed }) => (isPushed ? `2px solid ${theme.colors.primary}` : 0)};
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  z-index: 11;
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  transform: translate3d(0, 0, 0);
  ${({ isPushed }) => !isPushed && 'white-space: nowrap;'};

  ${({ theme }) => theme.mediaQueries.nav} {
    border-right: ${({ theme }) => `2px solid ${theme.colors.primary}`};
    width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`

const Panel: React.FC<Props> = (props) => {
  const { isPushed, showMenu, isMobile } = props
  return (
    <StyledPanel isPushed={isPushed} showMenu={showMenu} isMobile={isMobile}>
      <PanelBody {...props} />
      <PanelFooter {...props} />
    </StyledPanel>
  )
}

export default Panel
