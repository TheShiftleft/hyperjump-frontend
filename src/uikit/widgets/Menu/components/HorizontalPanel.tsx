import React from 'react'
import styled from 'styled-components'
import HorizontalPanelBody from './HorizontalPanelBody'
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from '../config'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  showMenu: boolean
  isMobile: boolean
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean; isMobile: boolean }>`
  position: ${({ isMobile }) => (!isMobile ? 'relative' : 'fixed')};
  padding-top: 0;
  ${({ isMobile }) => (!isMobile ? 'top: 12px; left: 20px; ' : 'bottom: 0; background-color: rgba(13, 29, 54, 1)')};
  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  
  transition: padding-top 0.2s, width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border:none;
  z-index: 11;
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  width: 100%;
  transform: translate3d(0, 0, 0);
  ${({ isPushed }) => !isPushed && 'white-space: nowrap;'};

  ${({ theme }) => theme.mediaQueries.nav} {
    //border-right: ${({ theme }) => `2px solid ${theme.colors.primary}`};
    //width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`

const RootPanel = styled.div<{ isMobile: boolean }>`
  
`
const Panel: React.FC<Props> = (props) => {
  const { isPushed, showMenu, isMobile } = props
  return (
    <RootPanel isMobile={isMobile} >
      <StyledPanel isPushed={isPushed} showMenu={showMenu} isMobile={isMobile}>
        <HorizontalPanelBody {...props} />
      </StyledPanel>
    </RootPanel>
  )
}

export default Panel
