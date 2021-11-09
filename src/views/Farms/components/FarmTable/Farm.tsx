import React from 'react'
import styled from 'styled-components'
import { Text, Image, useMatchBreakpoints } from 'uikit'

export interface FarmProps {
  label: string
  pid: number
  image: string
}

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 80px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 150px;
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ image, label }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  return (
    <Container>
      {!(isXs || isSm) && (
        <IconImage src={`/images/farms/${image}.svg`} alt="icon" width={40} height={40} mr="8px" />
      )}
      <div>
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm
