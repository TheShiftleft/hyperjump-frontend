import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  border-radius: 20px;
  flex-grow: 1;
  flex-basis: 0;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    max-height: 100px;
  }
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 8px;
`

export const Title = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

// TODO: Use `Text` instead
export const Subtle = styled.span`
  color: ${({ theme }) => theme.colors.contrast};
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const Earned = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`

export const Staked = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`
