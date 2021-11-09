import styled from 'styled-components'
import { Button } from 'uikit'

export const ActionContainer = styled.div`
  padding: 8px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 20px;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
  }
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
`

export const ActionContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ActionButton = styled(Button)`
  width: 170px;
`