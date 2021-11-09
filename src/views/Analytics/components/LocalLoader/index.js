/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import PageLoader from 'components/PageLoader';
import { useDarkModeManager } from '../../../../contexts/Analytics/LocalStorage'

const rotate = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Loader = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  & > * {
    width: 256px;
  }
  & > img {
      animation: ${rotate} 800ms linear infinite;
  }
  position: relative;
  ${props =>
    props.fill && !props.height
      ? css`
          height: calc(100vh - 64px);
        `
      : css`
          height: 180px;
        `}
`

const LocalLoader = ({ fill }) => {
  const [darkMode] = useDarkModeManager()

  return (
    <Loader fill={fill}>
      <PageLoader />
    </Loader>
  )
}

export default LocalLoader
