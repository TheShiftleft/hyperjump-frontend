import { transparentize } from 'polished'
import React from 'react'
import { AlertTriangle } from 'react-feather'
import { Text } from 'uikit'
import styled, { css } from 'styled-components'
import { AutoColumn } from '../Column'

export const Wrapper = styled.div`
    position: relative;
`
const SwapCallbackErrorInner = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.failure)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.colors.failure};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.failure)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function SwapCallbackError({ error }: { error: string }) {
    return (
      <SwapCallbackErrorInner>
        <SwapCallbackErrorInnerAlertTriangle>
          <AlertTriangle size={24} />
        </SwapCallbackErrorInnerAlertTriangle>
        <p>{error}</p>
      </SwapCallbackErrorInner>
    )
  }