import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  margin-bottom: 16px;
  max-width: 300px;

  ${({ theme }) => theme.mediaQueries.lg} {
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: 100px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 300px;
    margin-right: 0;
    margin-bottom: 0;
    max-height: 100px;
  }
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 14px;
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
  align-self: center;
    margin-bottom: 8px;
    align-self: flex-start;
  }

`

export const Title = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

// TODO: Use `Text` instead
export const Subtle = styled.span`
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.textSubtle};
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
