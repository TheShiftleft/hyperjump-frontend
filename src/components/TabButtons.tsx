import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from 'uikit'

interface TabButtonsProps {
  hasStakeInFinished: boolean
  rootPath: string
}

const TabButtons: React.FC<TabButtonsProps> = ({ hasStakeInFinished, rootPath }) => {
  const { url } = useRouteMatch()
  const location = useLocation()

  let activeIndex
  switch (location.pathname) {
    case rootPath:
      activeIndex = 0
      break
    case `${rootPath}/history`:
      activeIndex = 1
      break
    case `${rootPath}/archived`:
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="primary">
        <ButtonMenuItem as={Link} to={`${url}`}>
          Live
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinished}>
          <ButtonMenuItem as={Link} to={`${url}/history`}>
            Finished
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default TabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
