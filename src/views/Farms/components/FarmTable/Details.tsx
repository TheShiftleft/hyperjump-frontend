import React from 'react'
import styled from 'styled-components'
import { Text, ChevronDownIcon, useMatchBreakpoints } from 'uikit'

interface DetailsProps {
  actionPanelToggled: boolean
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 20px;
`

const Details: React.FC<DetailsProps> = ({ actionPanelToggled }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const isMobile = isXs

  return (
    <Container>
      <Text color="primary" bold>
        {!isMobile && 'Details'}
      </Text>
      <ArrowIcon color="primary" toggled={actionPanelToggled} />
    </Container>
  )
}

export default Details
