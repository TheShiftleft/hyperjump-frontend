import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Image } from 'uikit'
import { useAllTokens } from 'hooks/Tokens'
import { filterTokens } from '../filtering'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  tokenSymbol?: string
  addLiquidityUrl?: string
  pairExchangeInfo?: string
  earnLabel?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const Container = styled.div`
  width: 100%;
`
const StyledHeading = styled(Heading)`
  margin: 16px 0px;
`
const IconImageSm = styled(Image)`
  width: 35px;
  height: 35px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, farmImage, tokenSymbol }) => {
  const allTokens = useAllTokens()
  const img_split = farmImage.split('-')
  const primaryImg = img_split[0]
  const secondaryImg = img_split[1]

  const searchPrimaryTokenIconName = filterTokens(Object.values(allTokens), primaryImg)
  const searchSecondTokenIconName = filterTokens(Object.values(allTokens), secondaryImg)

  const primaryImgName = searchPrimaryTokenIconName[0].address
  const secondaryImgName = searchSecondTokenIconName[0].address  

  return (
    <Wrapper flexDirection="column" justifyContent="space-between" alignItems="center" mb="12px">
      {img_split.length > 0 ? (
        <>
          <Image src={`/images/tokens/${secondaryImgName}.png`} alt={tokenSymbol} width={64} height={64} mb="6px" />
          <div style={{ position: 'absolute', margin: '31px 0 0 35px', borderRadius: '10px' }}>
            <IconImageSm src={`/images/tokens/${primaryImgName}.png`} alt="icon" width={32} height={32} mr="3px" />
          </div>
        </>
      ) : (
        <Image src={`/images/tokens/${primaryImgName}.png`} alt={tokenSymbol} width={64} height={64} mb="6px" />
      )}

      <Flex justifyContent="center">
        <StyledHeading size="lg" color="primary" fontFamily="Oswald">
          {lpLabel}
        </StyledHeading>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
