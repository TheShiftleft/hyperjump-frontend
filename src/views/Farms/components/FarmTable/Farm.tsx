import React from 'react'
import styled from 'styled-components'
import { Text, Image, useMatchBreakpoints } from 'uikit'
import { useAllTokens } from 'hooks/Tokens'
import { filterTokens } from '../filtering'

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

  const img_split = image.split('-')
  const primaryImg = img_split[0]
  const secondaryImg = img_split[1]

  const searchPrimaryTokenIconName = filterTokens(Object.values(allTokens), primaryImg)
  const searchSecondTokenIconName = filterTokens(Object.values(allTokens), secondaryImg)
  
  const primaryImgName = searchPrimaryTokenIconName[0]?.address
  const secondaryImgName = searchSecondTokenIconName[0]?.address
 
  return (
    <Container>
      {img_split.length > 0
        ? !(isXs || isSm) && (
            <>
              <IconImage src={`/images/tokens/${primaryImgName}.png`} alt="icon" width={40} height={40} mr="8px" />
              <div style={{ position: 'absolute', margin: '0 0 -22px 20px', borderRadius: '10px' }}>
                <IconImage src={`/images/tokens/${secondaryImgName}.png`} alt="icon" width={20} height={20} mr="8px" />
              </div>
            </>
          )
        : !(isXs || isSm) && (
            <IconImage src={`/images/tokens/${primaryImgName}.png`} alt="icon" width={40} height={40} mr="8px" />
          )}
      <div>
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm
