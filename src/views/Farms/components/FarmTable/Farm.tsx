import React from 'react'
import styled from 'styled-components'
import { Text, Image, useMatchBreakpoints } from 'uikit'
import { useAllTokens, useToken } from 'hooks/Tokens'

export interface FarmProps {
  label: string
  pid: number
  image: string
}

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`
const IconImageSm = styled(Image)`
  width: 15px;
  height: 15px;

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
  const allTokens = useAllTokens()
  const token = useToken()

  const img_split = image.split('-')
  const primaryImg = img_split[0]
  const secondaryImg = img_split[1]

  console.log('allTokens', allTokens)
  
  return (
    <Container>
      {img_split.length > 0
        ? !(isXs || isSm) && (
            <>
              <IconImage src={`/images/tokens/${primaryImg}.png`} alt="icon" width={40} height={40} mr="8px" />
              <div style={{ position: 'absolute', margin: '0 0 -22px 20px', borderRadius: '10px' }}>
                <IconImage src={`/images/tokens/${secondaryImg}.png`} alt="icon" width={20} height={20} mr="8px" />
              </div>
            </>
          )
        : !(isXs || isSm) && (
            <IconImage src={`/images/farms/${image}.svg`} alt="icon" width={40} height={40} mr="8px" />
          )}
      <div>
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm
