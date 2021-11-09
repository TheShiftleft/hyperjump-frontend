import styled from 'styled-components'
import { Card, Box } from 'uikit'

interface PromotedStyleCardProps {
  isDesktop: boolean
}

export const StyledCard = styled(Card)<{ isPromoted?: PromotedStyleCardProps; isFinished?: boolean }>`
  border: 2px solid ${(props) => props.theme.colors.primary};
  align-self: baseline;
  background-size: cover;
  border-radius: 40px;
  background-color: rgba(13,29,54,0.5);
  justify-content: space-around;
  backdrop-filter: blur(2px);
  display: flex;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  flex-direction: column;
  position: relative;
  height: 100%;
`

export const StyledCardInner = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.card};
`

export default StyledCard
